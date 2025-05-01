// // LessonEditorPage.tsx
// import { useState } from "react";
// import TextBlock from "./TextBlockPage";
// import VideoBlock from "./VideoBlockPage";
// import QuizBlock from "./QuizBlockPage";
// import { v4 } from "uuid";

// type Block =
//   | { id: string; type: "text"; content: string }
//   | { id: string; type: "video"; url: string }
//   | { id: string; type: "quiz"; question: string; options: string[]; correctIndex: number };

// export default function LessonEditorPage() {
//   const [blocks, setBlocks] = useState<Block[]>([]);
//   const [activeId, setActiveId] = useState<string | null>(null);

//   const add = (type: Block["type"]) => {
//     const id = v4();
//     const newBlock: Block =
//       type === "text"
//         ? { id, type, content: "" }
//         : type === "video"
//         ? { id, type, url: "" }
//         : { id, type, question: "", options: ["", ""], correctIndex: 0 };

//     setBlocks((b) => [...b, newBlock]);
//     setActiveId(id);
//   };

//   const moveBlock = (index: number, direction: "up" | "down") => {
//     const newBlocks = [...blocks];
//     const targetIndex = direction === "up" ? index - 1 : index + 1;
//     if (targetIndex < 0 || targetIndex >= blocks.length) return;

//     const temp = newBlocks[targetIndex];
//     newBlocks[targetIndex] = newBlocks[index];
//     newBlocks[index] = temp;
//     setBlocks(newBlocks);
//   };

//   const updateBlock = (id: string, updated: Partial<Block>) => {
//     setBlocks((b) => b.map((x) => (x.id === id ? { ...x, ...updated } : x)));
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Left Sidebar */}
//       <aside className="w-48 p-4 bg-gray-50 space-y-2 border-r">
//         <button onClick={() => add("text")} className="btn w-full">+ Текст</button>
//         <button onClick={() => add("video")} className="btn w-full">+ Відео</button>
//         <button onClick={() => add("quiz")} className="btn w-full">+ Тест</button>
//         <button
//           onClick={() => console.log("SAVE", blocks)}
//           className="btn-primary mt-4 w-full"
//         >
//           💾 Зберегти
//         </button>
//       </aside>

//       {/* Main editor field */}
//       <main className="flex-1 p-6 space-y-4 overflow-y-auto bg-white">
//         {blocks.map((block, i) => {
//           const isActive = block.id === activeId;
//           return (
//             <div
//               key={block.id}
//               className={`relative border rounded p-4 shadow-sm ${isActive ? "ring-2 ring-blue-400" : ""}`}
//               onClick={() => setActiveId(block.id)}
//             >
//               {/* Controls */}
//               <div className="absolute -top-3 right-2 flex space-x-2 text-sm">
//                 <button onClick={() => moveBlock(i, "up")} disabled={i === 0}>⬆️</button>
//                 <button onClick={() => moveBlock(i, "down")} disabled={i === blocks.length - 1}>⬇️</button>
//                 <button onClick={() => setBlocks(b => b.filter(x => x.id !== block.id))}>🗑️</button>
//               </div>

//               {/* Content */}
//               {block.type === "text" && (
//                 <TextBlock
//                   content={block.content}
//                   isActive={isActive}
//                   onChange={(c) => updateBlock(block.id, { content: c })}
//                 />
//               )}
//               {block.type === "video" && (
//                 <VideoBlock
//                   url={block.url}
//                   onChange={(u) => updateBlock(block.id, { url: u })}
//                 />
//               )}
//               {block.type === "quiz" && (
//                 <QuizBlock
//                   {...block}
//                   onChange={(upd) => updateBlock(block.id, upd)}
//                 />
//               )}
//             </div>
//           );
//         })}
//       </main>

//       {/* Right panel */}
//       {activeId && blocks.find(b => b.id === activeId)?.type === "text" && (
//         <aside className="w-64 p-4 bg-gray-100 border-l">
//           <h3 className="font-bold mb-2">Редактор тексту</h3>
//           {/* Тут буде панель стилів: жирний, курсив і т.д. */}
//           <button className="btn">Жирний</button>
//           <button className="btn">Курсив</button>
//           {/* Редагується тільки активний блок */}
//         </aside>
//       )}
//     </div>
//   );
// }
