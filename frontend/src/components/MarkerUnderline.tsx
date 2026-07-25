// Elemento de assinatura da identidade visual: um traço de marca-texto
// (grifador) desenhado com SVG, imitando o gesto de destacar uma palavra
// importante no caderno — algo que todo vestibulando já fez mil vezes.

export default function MarkerUnderline({ color = "#FFC145" }: { color?: string }) {
  return (
    <svg
      viewBox="0 0 220 18"
      className="absolute left-0 -bottom-2 w-full h-4 -z-10"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 11 C 40 4, 80 15, 120 8 C 150 3, 180 13, 218 7"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        className="marker-stroke"
      />
    </svg>
  );
}
