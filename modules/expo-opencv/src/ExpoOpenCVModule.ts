import { requireNativeModule } from "expo";

import type { ImageNativeModule } from "./ExpoOpenCV.types";

export default requireNativeModule<ImageNativeModule>("ExpoOpenCV");
