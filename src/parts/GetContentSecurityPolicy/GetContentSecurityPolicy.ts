import * as Character from '../Character/Character.ts'
import * as AddSemiColon from '../AddSemiColon/AddSemiColon.ts'

export const getContentSecurityPolicy = (items: string[]) => {
  return items.map(AddSemiColon.addSemicolon).join(Character.Space)
}
