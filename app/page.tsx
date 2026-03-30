import SpellingGame from "@/components/SpellingGame";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Kindergarten Spelling Game",
  description: "A fun educational game for learning to spell new words",
};

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen flex flex-col items-center p-4 py-8 md:py-16 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 font-sans">
      <div className="w-full max-w-4xl text-center flex flex-col items-center flex-1">
        
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-6 w-full drop-shadow-sm">
          🌟 Spelling Adventure!
        </h1>
        
        <p className="text-lg md:text-xl text-gray-700 font-medium mb-12 max-w-2xl text-center">
          Listen to the magic words, pick the correct letters below, and spell them out to win! 
          We brought the best words for you today. Have fun! 🎉
        </p>

        <SpellingGame />
      </div>

      <footer className="mt-16 text-center text-gray-500 font-medium text-sm">
        <p>Created for fun spelling practice!</p>
      </footer>
    </main>
  );
}
