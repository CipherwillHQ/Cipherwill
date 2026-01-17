import { motion } from "framer-motion";

interface IntroTextProps {
  introText: string;
}

export default function IntroText({ introText }: IntroTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="text-4xl font-bold"
    >
      {introText}
    </motion.div>
  );
}