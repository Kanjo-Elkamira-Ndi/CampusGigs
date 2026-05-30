import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";

interface Expert {
  id: string;
  name: string;
  university: string;
  skill: string;
  rating: number;
}

const EXPERTS: Expert[] = [
  { id: "u1", name: "Sarah N.", university: "University of Yaoundé I", skill: "Tutor", rating: 4.9 },
  { id: "u2", name: "Daniel K.", university: "YIBS", skill: "Web Developer", rating: 5.0 },
  { id: "u5", name: "Linda T.", university: "University of Buea", skill: "Event Assistant", rating: 4.8 },
  { id: "u6", name: "Patrick M.", university: "ENSP", skill: "Graphic Designer", rating: 4.9 },
];

const FLOAT_ANIMS = [
  { y: [0, -8, 0], rotate: [0, 0.5, 0], duration: 5, delay: 0 },
  { y: [0, -12, 0], rotate: [0, -0.8, 0], duration: 6, delay: 0.5 },
  { y: [0, -6, 0], rotate: [0, 0.3, 0], duration: 4.5, delay: 1 },
  { y: [0, -10, 0], rotate: [0, -0.4, 0], duration: 5.5, delay: 1.5 },
];

const OFFSETS = [
  { x: 0, y: 0, z: 4 },
  { x: 30, y: 50, z: 3 },
  { x: -20, y: 100, z: 2 },
  { x: 10, y: 145, z: 1 },
];

export function FloatingExpertCards() {
  return (
    <div className="relative w-full h-[520px]">
      {EXPERTS.map((expert, i) => {
        const anim = FLOAT_ANIMS[i];
        const offset = OFFSETS[i];
        return (
          <motion.div
            key={expert.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: "easeOut" }}
            className="absolute"
            style={{
              left: `calc(50% + ${offset.x}px)`,
              top: `${offset.y}px`,
              zIndex: offset.z,
              transform: `translateX(-50%)`,
            }}
          >
            <motion.div
              animate={{ y: anim.y, rotate: anim.rotate }}
              transition={{
                duration: anim.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: anim.delay,
              }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
              className="w-72 rounded-3xl bg-white p-5 shadow-2xl cursor-pointer"
              style={{
                boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.15)",
              }}
            >
              <div className="flex items-start gap-3">
                <Avatar id={expert.id} name={expert.name} size={44} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#0A1628] text-sm truncate">{expert.name}</h4>
                  <p className="text-[11px] text-gray-500 truncate">{expert.university}</p>
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: "rgba(15, 139, 255, 0.1)", color: "var(--brand)" }}>
                    {expert.skill}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-sm">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="font-semibold text-[#0A1628]">{expert.rating.toFixed(1)}</span>
                <span className="text-gray-400 text-xs">· Verified Student</span>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
