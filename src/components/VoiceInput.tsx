import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

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
      recognizer.interimResults = true;
      recognizer.lang = 'my-MM'; // Myanmar language support

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (event.results[0].isFinal) {
          onTranscript(transcript);
          setIsListening(false);
        }
      };

      recognizer.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setError('Microphone permission denied');
        } else if (event.error === 'no-speech') {
          // Silent failure for no speech
        } else {
          setError(event.error);
        }
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

  const toggleListening = useCallback(async () => {
    if (!recognition) return;

    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Medium });
    }

    if (isListening) {
      recognition.stop();
    } else {
      setError(null);
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error('Start error', err);
        setIsListening(false);
      }
    }
  }, [isListening, recognition]);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        disabled={!!error && error.includes('supported')}
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
          isListening 
            ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
            : "bg-surface-dark/5 text-surface-dark hover:bg-surface-dark/10",
          !!error && error.includes('permission') && "bg-amber-100 text-amber-600"
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
          ) : error && error.includes('permission') ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <AlertCircle className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="static"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Mic className="h-6 w-6 opacity-40" />
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
      
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-surface-dark px-3 py-1 text-xs font-medium text-white shadow-xl"
          >
            <div className="flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin text-red-400" />
              နားထောင်နေသည်...
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold uppercase tracking-wider text-red-500"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
