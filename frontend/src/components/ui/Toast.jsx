import { useEffect, useState, useRef } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
};

const colors = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
};

const iconColors = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-amber-500",
};

const Toast = ({ message, type = "success", duration = 4000, onClose }) => {
  const [visible, setVisible] = useState(true);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const Icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onCloseRef.current?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      className={`fixed top-6 right-6 z-[100] max-w-sm w-full border-2 rounded-2xl shadow-2xl p-4 flex items-start gap-3 transition-all duration-300 ${colors[type]} ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColors[type]}`} />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(() => onCloseRef.current?.(), 300); }} className="flex-shrink-0 hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
