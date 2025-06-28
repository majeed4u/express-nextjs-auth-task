import { Flag } from "lucide-react"; // Import Flag icon from lucide-react

export type Priority = 0 | 1 | 2; // Define the type for priority levels (0: Low, 1: Medium, 2: High)

type PriorityMapType = {
  [key in Priority]: {
    color: string;
    iconColor: string;
    text: string;
  };
};

// Priority mapping for colors and text
export const priorityMap: PriorityMapType = {
  0: {
    text: "Low",
    color: "bg-green-100 text-green-800 border-green-200",
    iconColor: "text-green-500",
  },
  1: {
    text: "Medium",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    iconColor: "text-yellow-500",
  },
  2: {
    text: "High",
    color: "bg-red-100 text-red-800 border-red-200",
    iconColor: "text-red-500",
  },
};

interface PriorityTagProps {
  priority: Priority;
}

export const PriorityTag = ({ priority }: PriorityTagProps) => (
  <div
    className={`flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium border ${priorityMap[priority].color}`}
  >
    <Flag className={`w-3 h-3 ${priorityMap[priority].iconColor}`} />
    <span>{priorityMap[priority].text}</span>
  </div>
);
