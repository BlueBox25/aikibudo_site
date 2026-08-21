/** Romanian mobile numbers, written locally as 07xx xxx xxx. */
const COUNTRY_CODE = '40'

const digitsOnly = (phone) => String(phone ?? '').replace(/\D/g, '')

export const telLink = (phone) => `tel:${digitsOnly(phone)}`

/**
 * wa.me is WhatsApp's own click-to-chat address, and it routes itself:
 * the desktop app or web.whatsapp.com on a computer, the installed app on a
 * phone, and the relevant app store when the phone has no WhatsApp yet.
 * It needs the number in international form, digits only, without a plus.
 */
export function waLink(phone) {
  let digits = digitsOnly(phone)
  if (!digits) return null

  if (digits.startsWith('00')) digits = digits.slice(2)
  else if (digits.startsWith('0')) digits = COUNTRY_CODE + digits.slice(1)
  else if (!digits.startsWith(COUNTRY_CODE)) digits = COUNTRY_CODE + digits

  return `https://wa.me/${digits}`
}
