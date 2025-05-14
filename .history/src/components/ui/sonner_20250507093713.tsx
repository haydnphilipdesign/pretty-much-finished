import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      expand
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-800 group-[.toaster]:border-2 group-[.toaster]:border-blue-300 group-[.toaster]:rounded-lg group-[.toaster]:shadow-xl",
          description: "group-[.toast]:text-slate-700 group-[.toast]:font-medium",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:rounded-md group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:rounded-md group-[.toast]:font-medium",
          title: "group-[.toast]:text-base group-[.toast]:font-semibold",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
