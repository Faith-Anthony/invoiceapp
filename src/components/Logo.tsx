import logoImage from '../assets/logo (2).jpg'

export function Logo() {
  return (
    <img 
      src={logoImage} 
      alt="Logo" 
      className="w-full h-full object-cover"
    />
  )
}
