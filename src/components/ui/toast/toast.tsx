import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  XIcon,
} from "lucide-react";
import { type ElementType, useMemo } from "react";
import { toast as sonnerToast, ToastT } from "sonner";
import { Button, ButtonProps } from "../button/button";
export type ToastType = "success" | "info" | "warning" | "error";

interface ToastButtonType extends ButtonProps {
  label: string;
  onClick: () => void;
}

export interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  type?: ToastType;
  /**
   * Should the close button be displayed. Defaults to true. Only disable this for toasts that can be closed with the provided buttons
   */
  showClose?: boolean;
  variant?: "inline" | "expanded";
  /**
   * Provide up to two buttons to be rendered in the toast. The first button is always treated as the primary button.
   */
  buttons?: [ToastButtonType, ToastButtonType?];
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  duration?: number;
  onDismiss?: (toast: ToastT) => void;
}

export function showToast(toastProps: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id) => <Toast id={id} {...toastProps} />, {
    position: toastProps.position,
    duration: toastProps.duration || 6000,
    onDismiss: toastProps.onDismiss,
  });
}

const toastVariants = cva("flex text-sm p-1.5", {
  variants: {
    variant: {
      inline: "flex-row items-center gap-2",
      expanded: "flex-col justify-start gap-3",
    },
  },
});

const iconVariants = cva("ml-1.5 my-1.5 size-5 flex-shrink-0", {
  variants: {
    type: {
      success: "text-green-500",
      info: "text-gray-400",
      warning: "text-yellow-500",
      error: "text-red-500",
    },
  },
});

function Toast({
  title,
  description,
  buttons,
  type = "info",
  variant = "inline",
  showClose = true,
  id,
}: ToastProps) {
  const DefaultIcon = useMemo(() => {
    let _icon: ElementType;
    switch (type) {
      case "error":
        _icon = AlertCircle;
        break;
      case "warning":
        _icon = AlertTriangle;
        break;
      case "info":
        _icon = Info;
        break;
      case "success":
        _icon = CheckCircle;
        break;
      default:
        _icon = Info;
    }
    return _icon;
  }, [type]);

  return (
    <div className="flex items-start gap-2 rounded-2xl bg-gray-25 p-1.5 shadow-toast">
      <DefaultIcon className={cn(iconVariants({ type }))} />

      <div className={cn(toastVariants({ variant }))}>
        <section
          className={`flex ${variant === "expanded" ? "flex-col gap-1" : "gap-2"}`}
        >
          <h4 className="font-medium">{title}</h4>
          {description && <p className="text-gray-500">{description}</p>}
        </section>

        {buttons?.length && variant === "expanded" && (
          <div className="flex gap-3 self-stretch pb-1">
            {buttons?.map((buttonProps, index) => (
              <Button
                {...buttonProps}
                key={index}
                size="sm"
                variant={index === 0 ? "neutral" : "link"}
              />
            ))}
          </div>
        )}
      </div>

      {showClose && (
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          iconLeft={XIcon}
          className="ml-auto"
          onClick={() => sonnerToast.dismiss(id)}
        />
      )}
    </div>
  );
}

export { Toast };
