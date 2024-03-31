import { classNames } from "@/modules/functions/css";
import { MotionProps, motion } from "framer-motion";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>, // Exclude conflicting HTML button element props
  keyof MotionProps // from Framer Motion's MotionProps interface
> &
  MotionProps; // and add Framer Motion's animation props

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <motion.button
      ref={ref}
      className={classNames(
        "transition-colors outline-none rounded-xl disabled:cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
);

export default Button;
