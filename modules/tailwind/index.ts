import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/tailwind.config";

const tw: any = resolveConfig(tailwindConfig).theme;
export default tw;
