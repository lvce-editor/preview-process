import * as AddSemiColon from '../AddSemiColon/AddSemiColon.ts'
import * as Character from '../Character/Character.ts'

export const getContentSecurityPolicy = (items: string[]) => {
  return items.map(AddSemiColon.addSemicolon).join(Character.Space)
}
