# Vokabul stilguide (forside)

Denne stilguiden beskriver uttrykket pa forsiden og skal brukes som fasit ved ny UI.

## Merkevare og tone
- Varm, leken og trygg. Myke kort, runde former, lette skygger.
- Kontrast og lesbarhet foran dekor. Tekst er alltid tydelig.

## Typografi
- Overskrifter: "Fraunces" (serif), tung og elegant.
- Brødtekst og UI: "Space Grotesk" (sans), ren og moderne.
- Typisk skala:
  - H1: clamp(32px, 4vw, 46px)
  - Korttittel: 20-22px, 700 vekt
  - Tekst: 16px, line-height 1.6

## Farger (tokens)
Bruk disse variablene som grunnlag:

```css
:root {
  --bg: #f7f1e6;
  --card: #ffffff;
  --ink: #1b1a17;
  --muted: #5a5247;
  --accent: #e96b3c;
  --accent-2: #2b7a78;
  --accent-3: #f2c94c;
  --line: #e7d9c7;
  --shadow: 0 18px 40px rgba(21, 18, 14, 0.12);
}
```

- Bakgrunn: varm beige gradient, aldri helt flat.
- Kort: hvite eller svakt tonede gradienter.
- Aksenter: coral (primar), teal (sekundaer), gul (highlight).

## Bakgrunn og atmosfaere
- Bruk lagdelte radial-gradienter + soft lineær gradient.
- Subtile fargeflater i kort via ::after med radial-gradient.

## Layout og rytme
- Maks bredde: 1100px, sentrert.
- Stort luftrom: 32-56px mellom hovedseksjoner.
- Grid med auto-fit for kort (min 240px).
- Mobil: enkel kolonne, tett men luftig padding.

## Komponenter
### Knapp
- Runde piller (border-radius: 999px).
- Tydelig skygge og lett hover-lift.
- Varianter:
  - primary: accent (coral)
  - secondary: accent-2 (teal)
  - ghost: svak coral bakgrunn

### Kort
- Hvit base med mild gradient.
- Radius 22-28px.
- Lett skygge (12-18px).
- Hover: litt heving og sterkere skygge.

### Modal
- Bruk backdrop med svak warm tint og blur (ikke helt svart).
- Modal-kort: samme radius som kort (22-28px) og hvit/mild gradient.
- Maks bredde 520-640px; mobil: 92vw og full bredde innvendig padding.
- Tydelig lukkeknapp oppe til hoeyre (ghost-stil), og CTA nederst.
- Fokus pa innhold: begrens tekstbredde til 360-440px.

### Tekstblokker
- Bruk muted til forklaringer.
- Maksbredde 360-440px for lange avsnitt.

## Animasjon
- Fade-up ved innlasting.
- Kort: sekvens med små delays (0.1s steg).
- Bevegelse er rolig og subtil, aldri "snappy".

## Ikonografi og detaljer
- Bruk enkle piller/etiketter for metadata.
- Understrekte lenker kun ved hover.

## Do / Don't
- Do: hold deg til varme toner og myke skygger.
- Do: bruk korte, aktive CTA-er.
- Don't: bruk harde kanter eller skarpe neonfarger.
- Don't: legg alt i flate gra bakgrunner.

## Referanse
Stil hentet fra forsiden i `index.html` og `style.css`.
