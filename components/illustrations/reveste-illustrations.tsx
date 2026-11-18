"use client"

import Box, { type BoxProps } from "@mui/material/Box"

interface IllustrationProps extends BoxProps {
  size?: number | string
}

/**
 * 1. Ilustração de Busca Vazia / Garimpo (Estilo Flat Editorial)
 * Ideal para o Empty State do ProductGrid
 */
export function EmptyCatalogIllustration({ size = 210, sx, ...props }: IllustrationProps) {
  return (
    <Box
      sx={{
        width: size,
        height: "auto",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        ...sx,
      }}
      {...props}
    >
      <svg viewBox="0 0 280 220" width="100%" height="100%" fill="none" aria-hidden>
        {/* Mancha orgânica de fundo */}
        <path
          d="M42 152C24 114 48 54 96 42C144 30 176 58 214 74C252 90 264 142 232 174C200 206 60 190 42 152Z"
          fill="#E8EFE9"
        />

        {/* Estrelinhas decorativas estilo iFood */}
        <path d="M58 52L61 61L70 64L61 67L58 76L55 67L46 64L55 61L58 52Z" fill="#BD5E2B" />
        <path d="M224 46L226 52L232 54L226 56L224 62L222 56L216 54L222 52L224 46Z" fill="#81C784" />
        <circle cx="236" cy="112" r="4" fill="#F4A261" />

        {/* Arara / Cabideiro minimalista à esquerda */}
        <rect x="64" y="68" width="5" height="118" rx="2.5" fill="#1B3B24" />
        <rect x="46" y="182" width="42" height="6" rx="3" fill="#1B3B24" />
        <rect x="64" y="72" width="76" height="5" rx="2.5" fill="#1B3B24" />

        {/* Cabide vazio balançando */}
        <path
          d="M104 76C104 71 110 71 110 76C110 79 107 80 107 83L92 94H122L107 83"
          stroke="#BD5E2B"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Personagem estilizada procurando (proporções exageradas) */}
        {/* Pernas / Calça ampla terracota */}
        <path d="M154 134L142 186H162L172 146L182 186H202L190 134H154Z" fill="#BD5E2B" />
        {/* Tênis branco com detalhe verde */}
        <path d="M134 186H162V193H130C130 189 132 186 134 186Z" fill="#FFFFFF" />
        <path d="M182 186H210C212 186 214 189 214 193H182V186Z" fill="#FFFFFF" />
        <rect x="130" y="191" width="32" height="3" rx="1.5" fill="#1B3B24" />
        <rect x="182" y="191" width="32" height="3" rx="1.5" fill="#1B3B24" />

        {/* Tronco / Suéter Verde Floresta */}
        <path
          d="M148 92C148 82 158 76 172 76C186 76 196 82 196 92L202 136H144L148 92Z"
          fill="#1B3B24"
        />

        {/* Braço esquerdo estendido segurando lupa grande */}
        <path
          d="M150 92C134 96 122 108 118 122"
          stroke="#8D4B66"
          strokeWidth="13"
          strokeLinecap="round"
        />
        {/* Braço direito na cintura */}
        <path
          d="M193 92C206 100 210 116 196 124"
          stroke="#8D4B66"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Cabelo volumoso geométrico */}
        <path
          d="M156 54C156 38 188 36 196 54C204 72 196 84 184 84H162C152 84 156 66 156 54Z"
          fill="#3E1F32"
        />
        {/* Rosto */}
        <circle cx="171" cy="62" r="12" fill="#8D4B66" />
        {/* Olhinhos e expressão curiosa */}
        <circle cx="167" cy="60" r="1.8" fill="#161616" />
        <circle cx="174" cy="60" r="1.8" fill="#161616" />
        <circle cx="170" cy="66" r="2.2" fill="#161616" />

        {/* Lupa oversized estilo editorial */}
        <line
          x1="118"
          y1="122"
          x2="104"
          y2="138"
          stroke="#1B3B24"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="126" cy="112" r="16" fill="#FFFFFF" fillOpacity="0.85" stroke="#F4A261" strokeWidth="5" />
        <path d="M120 107C122 104 126 103 130 105" stroke="#81C784" strokeWidth="2.5" strokeLinecap="round" />

        {/* Base do chão */}
        <rect x="38" y="193" width="204" height="5" rx="2.5" fill="#C8D6CA" />
      </svg>
    </Box>
  )
}

/**
 * 2. Ilustração de Desapego Comunitário (Sacola Circular + Coração)
 * Ideal para o card DesapegoCta
 */
export function DesapegoIllustration({ size = 140, sx, ...props }: IllustrationProps) {
  return (
    <Box
      sx={{
        width: size,
        height: "auto",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
        ...sx,
      }}
      {...props}
    >
      <svg viewBox="0 0 200 180" width="100%" height="100%" fill="none" aria-hidden>
        {/* Aura translúcida atrás */}
        <circle cx="100" cy="94" r="68" fill="#FFFFFF" fillOpacity="0.14" />

        {/* Estrelas e brilhos */}
        <path d="M34 42L37 50L45 53L37 56L34 64L31 56L23 53L31 50L34 42Z" fill="#FFCCBC" />
        <path d="M164 34L166 40L172 42L166 44L164 50L162 44L156 42L162 40L164 34Z" fill="#A5D6A7" />

        {/* Braço e mão expressiva segurando a sacola */}
        <path
          d="M18 118C44 114 66 98 84 82"
          stroke="#F4A261"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Sacola de brechó em escala ampliada */}
        {/* Alça traseira */}
        <path
          d="M84 68C84 48 118 48 118 68"
          stroke="#1B3B24"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Corpo da sacola */}
        <path d="M68 68H134L142 152H60L68 68Z" fill="#FBF9F5" />
        {/* Lateral sombreada 3D da sacola */}
        <path d="M134 68L142 152L156 144L146 64L134 68Z" fill="#DCE5DD" />
        {/* Alça frontal */}
        <path
          d="M90 72C90 52 124 52 124 72"
          stroke="#2E6B3E"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Peça dobrada saindo do topo da sacola */}
        <path d="M76 68C82 56 102 56 108 68H76Z" fill="#81C784" />
        <path d="M104 68C110 58 126 58 130 68H104Z" fill="#E76F51" />

        {/* Símbolo ReVeste (Folha + Coração) estampado na sacola */}
        <circle cx="101" cy="110" r="21" fill="#1B3B24" />
        <path
          d="M101 120C101 120 89 112.5 89 104.5C89 100.8 91.9 98 95.5 98C97.8 98 99.8 99.2 101 101C102.2 99.2 104.2 98 106.5 98C110.1 98 113 100.8 113 104.5C113 112.5 101 120 101 120Z"
          fill="#81C784"
        />

        {/* Folha botânica flutuante */}
        <path
          d="M150 106C164 100 176 108 174 122C160 124 148 116 150 106Z"
          fill="#A5D6A7"
        />
      </svg>
    </Box>
  )
}

/**
 * 3. Ilustração de Comunidade & Impacto Positivo
 * Ideal para o topo da seção de Reputação ou confirmação de reserva
 */
export function CircularCelebrationIllustration({ size = 180, sx, ...props }: IllustrationProps) {
  return (
    <Box
      sx={{
        width: size,
        height: "auto",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        ...sx,
      }}
      {...props}
    >
      <svg viewBox="0 0 240 180" width="100%" height="100%" fill="none" aria-hidden>
        <ellipse cx="120" cy="156" rx="88" ry="12" fill="#E3EBE4" />

        {/* Estrelas e confetes sustentáveis */}
        <path d="M46 46L49 54L57 57L49 60L46 68L43 60L35 57L43 54L46 46Z" fill="#F4A261" />
        <path d="M194 42L197 50L205 53L197 56L194 64L191 56L183 53L191 50L194 42Z" fill="#BD5E2B" />
        <circle cx="120" cy="24" r="5" fill="#81C784" />

        {/* Personagem Esquerda (camisa terracota) */}
        <path d="M62 96C62 84 72 78 84 78C96 78 106 84 106 96L110 152H58L62 96Z" fill="#BD5E2B" />
        <circle cx="84" cy="60" r="13" fill="#7B3F58" />
        <path d="M71 56C71 42 97 42 97 56C97 50 71 50 71 56Z" fill="#1B3B24" />
        <circle cx="80" cy="59" r="1.7" fill="#111" />
        <circle cx="88" cy="59" r="1.7" fill="#111" />
        <path d="M81 64C82.5 66 85.5 66 87 64" stroke="#111" strokeWidth="1.8" strokeLinecap="round" />

        {/* Personagem Direita (camisa verde-floresta) */}
        <path d="M134 94C134 82 144 76 156 76C168 76 178 82 178 94L182 152H130L134 94Z" fill="#1B3B24" />
        <path d="M142 48C142 36 172 36 174 54C176 68 168 76 156 76C144 76 140 62 142 48Z" fill="#3E1F32" />
        <circle cx="156" cy="60" r="12" fill="#9E5A76" />
        <circle cx="152" cy="59" r="1.7" fill="#111" />
        <circle cx="160" cy="59" r="1.7" fill="#111" />
        <path d="M153 64C154.5 66 157.5 66 159 64" stroke="#111" strokeWidth="1.8" strokeLinecap="round" />

        {/* Medalhão / Emblema central compartilhado entre os dois */}
        <circle cx="120" cy="108" r="24" fill="#FFFFFF" stroke="#81C784" strokeWidth="4" />
        <path
          d="M120 96L123.5 103.5L131.5 104.5L125.5 110L127 118L120 114L113 118L114.5 110L108.5 104.5L116.5 103.5L120 96Z"
          fill="#F4A261"
        />
      </svg>
    </Box>
  )
}