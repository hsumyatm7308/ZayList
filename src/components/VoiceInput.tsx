import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceInput({ onTranscript, className }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognizer = new SpeechRecognition();
      
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = 'my-MM'; // Myanmar language support

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognizer.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setError(event.error);
        setIsListening(false);
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognizer);
    } else {
      setError('Speech recognition not supported');
    }
  }, [onTranscript]);

  const toggleListening = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      setError(null);
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error('Start error', err);
      }
    }
  }, [isListening, recognition]);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        disabled={!!error && error !== 'no-speech'}
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
          isListening 
            ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
            : "bg-surface-dark/5 text-surface-dark hover:bg-surface-dark/10"
        )}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Mic className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="static"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <MicOff className="h-6 w-6 opacity-40" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse effect when listening */}
        {isListening && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-red-500"
          />
        )}
      </motion.button>
      
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-surface-dark px-3 py-1 text-xs font-medium text-white shadow-xl"
        >
          <div className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            နားထောင်နေသည်...
          </div>
        </motion.div>
      )}
    </div>
  );
}
