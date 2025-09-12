import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "danger",
  loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: "text-red-400",
      button: "bg-red-600 hover:bg-red-700",
      border: "border-red-600/50",
    },
    warning: {
      icon: "text-yellow-400",
      button: "bg-yellow-600 hover:bg-yellow-700",
      border: "border-yellow-600/50",
    },
    info: {
      icon: "text-blue-400",
      button: "bg-blue-600 hover:bg-blue-700",
      border: "border-blue-600/50",
    },
  };

  const styles = typeStyles[type];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-gray-800 rounded-xl border ${styles.border} p-6 max-w-md w-full`}>
        <div className="flex items-center mb-4">
          <AlertTriangle className={`h-6 w-6 mr-3 ${styles.icon}`} />
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        
        <p className="text-gray-300 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={styles.button}
            disabled={loading}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : null}
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}