import { AppModel } from "./app.model"

export interface DashBoardSection {
  titleTranslationKey?: string
  apps: AppModel[]
}