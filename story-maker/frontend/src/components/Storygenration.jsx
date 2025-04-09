import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsPDF } from "jspdf";
import { TailSpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StoryGeneration = () => {
  // Simplified state management with objects
  const [formData, setFormData] = useState({
    title: "",
    characterDescription: "",
    message: "",
    wordCount: 300,
    language: "english",
  });
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState({ story: false, images: false });
  const [images, setImages] = useState([]);

  // Handles all form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Initialize Google Gemini API
  const genAI = new GoogleGenerativeAI(
    "AIzaSyDznSrpkIafXf7-czR6UlQKyID4_M9n0Qw"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const generationConfig = {
    temperature: 0.8,
    topP: 0.9,
    topK: 32,
    maxOutputTokens: 1024,
    responseMimeType: "text/plain",
  };

  // Generate story using Google Gemini API
  const generateStory = async () => {
    const { title, characterDescription, message } = formData;
    if (!title || !characterDescription || !message) {
      toast.error("Please fill in all the mandatory fields.");
      return;
    }

    setLoading({ ...loading, story: true });
    setStory("");
    setImages([]);

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [{ text: "Hi, I'd like you to act as a story writer.\n" }],
          },
          {
            role: "model",
            parts: [
              {
                text: "Okay, I'm ready! Tell me what kind of story you have in mind.\n",
              },
            ],
          },
        ],
      });

      const languageInstruction =
        formData.language === "marathi"
          ? "Write the story in Marathi language using Devanagari script."
          : "";

      const userPrompt = `Generate a story with the title "${title}".
      The main character is described as: ${characterDescription}.
      Additionally, ${message}.
      The story should be approximately ${formData.wordCount} words long and use engaging and descriptive language.
      ${languageInstruction}`;

      const result = await chatSession.sendMessage(userPrompt);
      const generatedText = result.response.text();

      if (generatedText) {
        setStory(generatedText);
        toast.success("Story generated successfully!");
        extractKeyScenes(generatedText);
      } else {
        toast.error(
          "Could not generate story. Please try again with different inputs."
        );
      }
    } catch (err) {
      console.error("Error generating story:", err);
      toast.error(
        "Error generating story: " + (err.message || "Unknown error")
      );
    } finally {
      setLoading({ ...loading, story: false });
    }
  };

  // Extract key scenes from the story for image generation
  const extractKeyScenes = async (storyText) => {
    try {
      const chatSession = model.startChat({
        generationConfig: { ...generationConfig, maxOutputTokens: 512 },
      });

      const promptForScenes = `
        From the following story, identify 3 key visual scenes that would make good illustrations.
        Describe each scene in 1-2 sentences that focus on visual elements.
        Format the output as a numbered list with each scene description.
        
        Story: ${storyText.substring(0, 2000)}`;

      const result = await chatSession.sendMessage(promptForScenes);
      const scenesText = result.response.text();
      const sceneRegex = /(\d+\.[\s\S]*?)(?=\d+\.|$)/g;
      const matches = [...scenesText.matchAll(sceneRegex)];
      const scenes = matches.map((match) => match[0].trim());

      if (scenes.length > 0) {
        generateMultipleImages(scenes);
      } else {
        const defaultScenes = [
          `1. ${formData.title} - main scene with ${formData.characterDescription}`,
          `2. Another moment from the story with ${formData.characterDescription}`,
          `3. Final scene from ${formData.title}`,
        ];
        generateMultipleImages(defaultScenes);
      }
    } catch (err) {
      console.error("Error extracting scenes:", err);
      toast.warning("Using default scenes for image generation");

      const defaultScenes = [
        `1. ${formData.title} - main scene with ${formData.characterDescription}`,
        `2. Another moment from the story with ${formData.characterDescription}`,
        `3. Final scene from ${formData.title}`,
      ];
      generateMultipleImages(defaultScenes);
    }
  };

  // Generate multiple images based on the extracted scenes
  const generateMultipleImages = async (scenes) => {
    setLoading({ ...loading, images: true });
    setImages([]);

    toast.info(`Generating ${scenes.length} images for your story...`, {
      autoClose: 3000,
    });

    const newImages = [];
    let successCount = 0;
    const scenesToProcess = scenes.slice(0, 3);

    for (let i = 0; i < scenesToProcess.length; i++) {
      try {
        const scene = scenesToProcess[i];
        const enhancedPrompt = `Detailed illustration for a children's storybook: ${scene.replace(
          /^\d+\.\s*/,
          ""
        )}. Digital art style, vibrant colors, clear details.`;

        const response = await fetch(
          "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
          {
            headers: {
              Authorization: "Bearer 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",
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              inputs: enhancedPrompt,
              parameters: {
                guidance_scale: 7.5,
                num_inference_steps: 30,
                width: 512,
                height: 512,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        newImages.push({
          url: imageUrl,
          caption: scene.replace(/^\d+\.\s*/, "").replace(/^Scene \d+:\s*/, ""),
        });

        successCount++;
        toast.success(`Image ${successCount} generated!`);
      } catch (err) {
        console.error("Error generating image:", err);
        toast.error(
          `Failed to generate image ${i + 1}: ${err.message || "Unknown error"}`
        );
      }
    }

    setImages(newImages);
    setLoading({ ...loading, images: false });

    if (newImages.length > 0) {
      toast.success(`Generated ${newImages.length} images for your story!`);
    } else {
      toast.error("Could not generate any images. Please try again later.");
    }
  };

  // Download the story with images as PDF
  const downloadPDF = async () => {
    if (!story) {
      toast.warn("Please generate a story before downloading.");
      return;
    }

    try {
      toast.info("Creating your PDF...");
      const doc = new jsPDF();
      let yPosition = 30;

      // Add title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(formData.title, 20, yPosition);
      yPosition += 10;

      // Add story text
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      const splitText = doc.splitTextToSize(story, 170);
      doc.text(splitText, 20, yPosition);
      yPosition += splitText.length * 5 + 10;

      // Add images if available
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          doc.addPage();
          yPosition = 20;

          doc.setFontSize(12);
          doc.setFont("helvetica", "italic");
          doc.text(`Scene ${i + 1}: ${images[i].caption}`, 20, yPosition);
          yPosition += 10;

          try {
            const img = new Image();
            img.src = images[i].url;

            await new Promise((resolve, reject) => {
              img.onload = () => {
                try {
                  const aspectRatio = img.width / img.height;
                  const imgWidth = 170;
                  const imgHeight = imgWidth / aspectRatio;

                  doc.addImage(img, "JPEG", 20, yPosition, imgWidth, imgHeight);
                  resolve();
                } catch (err) {
                  reject(err);
                }
              };
              img.onerror = reject;
              setTimeout(
                () => reject(new Error("Image loading timeout")),
                10000
              );
            });
          } catch (imageErr) {
            console.error(`Error processing image for PDF: ${imageErr}`);
            continue;
          }
        }
      }

      doc.save(`${formData.title}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(
        `Error generating PDF: ${error.message || "Please try again."}`
      );
    }
  };

  // Animation elements for story stickers
  const StoryStickers = () => {
    const stickers = [
      { icon: "📚", className: "top-10 left-10", delay: 0 },
      { icon: "🧚‍♀️", className: "top-20 right-20", delay: 1 },
      { icon: "🦄", className: "bottom-20 left-1/4", delay: 2 },
      { icon: "🏰", className: "top-1/3 right-10", delay: 0.5 },
      { icon: "🔮", className: "bottom-10 right-1/4", delay: 1.5 },
      { icon: "🧙‍♂️", className: "top-1/2 left-5", delay: 2.5 },
      { icon: "🦁", className: "bottom-1/3 right-20", delay: 3 },
      { icon: "⭐", className: "top-2/3 left-1/3", delay: 1 },
      { icon: "🌈", className: "bottom-1/4 left-10", delay: 2 },
      { icon: "🐉", className: "top-40 left-40", delay: 1.5 },
    ];

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stickers.map((sticker, index) => (
          <div
            key={index}
            className={`absolute ${sticker.className} animate-float opacity-30 text-4xl z-0`}
            style={{
              animationDelay: `${sticker.delay}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          >
            {sticker.icon}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <StoryStickers />
      </div>

      {/* Floating books */}
      <div className="book book1"></div>
      <div className="book book2"></div>
      <div className="book book3"></div>

      {/* Main Content */}
      <div className="relative z-10 p-6 flex flex-col items-center">
        <ToastContainer position="top-right" theme="dark" />

        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 mb-2">
            ✧ UNLEASH YOUR IMAGINATION ✧
          </h1>
          <p className="text-lg text-indigo-200">
            Create Unique Stories with Multiple AI-Generated Images
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-xl rounded-xl p-6 w-full max-w-xl mb-8">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label
                htmlFor="title"
                className="block text-indigo-100 text-sm font-medium mb-2"
              >
                ✨ Story Title <span className="text-pink-300">*</span>
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-4 py-2 bg-white bg-opacity-10 border border-indigo-300 border-opacity-30 rounded-lg text-white placeholder-indigo-200 placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Enter your story title..."
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label
                htmlFor="characterDescription"
                className="block text-indigo-100 text-sm font-medium mb-2"
              >
                👤 Main Character <span className="text-pink-300">*</span>
              </label>
              <input
                type="text"
                id="characterDescription"
                className="w-full px-4 py-2 bg-white bg-opacity-10 border border-indigo-300 border-opacity-30 rounded-lg text-white placeholder-indigo-200 placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Describe your main character..."
                value={formData.characterDescription}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-indigo-100 text-sm font-medium mb-2"
              >
                📝 Story Details <span className="text-pink-300">*</span>
              </label>
              <textarea
                id="message"
                className="w-full px-4 py-2 bg-white bg-opacity-10 border border-indigo-300 border-opacity-30 rounded-lg text-white placeholder-indigo-200 placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Add plot details, setting, or any specific elements..."
                value={formData.message}
                onChange={handleInputChange}
                rows="3"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="wordCount"
                  className="block text-indigo-100 text-sm font-medium mb-2"
                >
                  Word Count
                </label>
                <input
                  type="range"
                  id="wordCount"
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  value={formData.wordCount}
                  onChange={handleInputChange}
                  min="100"
                  max="1000"
                  step="50"
                />
                <div className="text-center text-indigo-200 text-sm mt-1">
                  {formData.wordCount} words
                </div>
              </div>

              <div>
                <label
                  htmlFor="language"
                  className="block text-indigo-100 text-sm font-medium mb-2"
                >
                  Language
                </label>
                <select
                  id="language"
                  className="w-full px-4 py-2 bg-white bg-opacity-10 border border-indigo-300 border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={formData.language}
                  onChange={handleInputChange}
                >
                  <option value="english" className="text-gray-800">
                    English
                  </option>
                  <option value="marathi" className="text-gray-800">
                    Marathi
                  </option>
                </select>
              </div>
            </div>

            <button
              className={`mt-2 px-4 py-2 rounded-lg font-bold text-white shadow-lg transform transition-all duration-300 ${
                loading.story ||
                !formData.title ||
                !formData.characterDescription ||
                !formData.message
                  ? "bg-indigo-400 bg-opacity-50 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 hover:scale-105"
              }`}
              onClick={generateStory}
              disabled={
                !formData.title ||
                !formData.characterDescription ||
                !formData.message ||
                loading.story
              }
            >
              {loading.story ? (
                <div className="flex items-center justify-center">
                  <TailSpin color="#ffffff" height={20} width={20} />
                  <span className="ml-2">Creating Story...</span>
                </div>
              ) : (
                <span>Generate Story & Images</span>
              )}
            </button>
          </div>
        </div>

        {/* Story Display */}
        {story && (
          <div className="w-full max-w-2xl mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-xl rounded-xl p-6">
              <h2 className="text-2xl font-bold text-purple-200 mb-2">
                {formData.title}
              </h2>
              <div className="my-4 text-white">
                {story.split("\n").map((paragraph, index) =>
                  paragraph ? (
                    <p key={index} className="mb-3">
                      {paragraph}
                    </p>
                  ) : (
                    <br key={index} />
                  )
                )}
              </div>

              <button
                onClick={downloadPDF}
                className="px-4 py-2 mt-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold flex items-center hover:scale-105 transition-transform"
                disabled={loading.images}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 16L12 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 13L12 16L15 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Download Story with Images (PDF)
              </button>
            </div>
          </div>
        )}

        {/* Image Gallery */}
        {loading.images && (
          <div className="w-full max-w-2xl text-center p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl">
            <TailSpin
              color="#ffffff"
              height={40}
              width={40}
              wrapperClass="mx-auto"
            />
            <p className="text-indigo-200 mt-4">
              Generating images for your story...
            </p>
          </div>
        )}

        {images.length > 0 && (
          <div className="w-full max-w-2xl mb-8">
            <h3 className="text-xl font-bold text-purple-200 mb-4">
              Story Illustrations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl overflow-hidden transform hover:scale-105 transition-transform"
                >
                  <img
                    src={image.url}
                    alt={`Scene ${index + 1}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%234b5563'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23f3f4f6'%3EImage failed to load%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="p-3">
                    <p className="text-xs text-indigo-200">{image.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced CSS for background effects and animations */}
      <style jsx>{`
        @keyframes twinkle {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.3;
          }
        }

        @keyframes twinkling {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(-10%, -10%);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }

        @keyframes bookFloat {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .stars {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background: transparent;
        }

        .stars:before {
          content: "";
          position: absolute;
          width: 120%;
          height: 120%;
          background-image: radial-gradient(
              2px 2px at 10px 10px,
              rgba(255, 255, 255, 0.8),
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(
              2px 2px at 40px 70px,
              rgba(255, 255, 255, 0.7),
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(
              3px 3px at 120px 40px,
              rgba(255, 255, 255, 0.8),
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(
              1px 1px at 140px 180px,
              rgba(255, 255, 255, 0.9),
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(
              2px 2px at 200px 20px,
              rgba(255, 255, 255, 0.8),
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(
              2px 2px at 300px 100px,
              rgba(255, 255, 255, 0.6),
              rgba(0, 0, 0, 0)
            );
          background-repeat: repeat;
          background-size: 600px 600px;
          animation: twinkle 4s infinite alternate;
        }

        .twinkling {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 110%;
          height: 110%;
          background-image: radial-gradient(
              3px 3px at 120px 80px,
              rgba(255, 255, 255, 0.8),
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(
              3px 3px at 200px 160px,
              rgba(255, 255, 255, 0.7),
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(
              4px 4px at 260px 40px,
              rgba(255, 255, 255, 0.6),
              rgba(0, 0, 0, 0)
            );
          background-repeat: repeat;
          background-size: 600px 600px;
          animation: twinkling 60s infinite linear;
        }

        /* Animated Books */
        .book {
          position: absolute;
          width: 60px;
          height: 80px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
          z-index: 1;
          opacity: 0.6;
          pointer-events: none;
        }

        .book:after {
          content: "📖";
          font-size: 30px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .book1 {
          top: 15%;
          left: 10%;
          animation: bookFloat 8s ease-in-out infinite;
        }

        .book2 {
          top: 60%;
          right: 15%;
          animation: bookFloat 12s ease-in-out infinite;
          animation-delay: 2s;
        }

        .book3 {
          bottom: 20%;
          left: 20%;
          animation: bookFloat 10s ease-in-out infinite;
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default StoryGeneration;
