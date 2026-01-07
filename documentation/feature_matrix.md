# Feature / Technologie Matrix - Team ET1 Show 2026

Diese Dokumentation gibt einen Überblick über die Kern-Features der App, die verwendeten Technologien und deren Implementierung im Code nach dem Architektur-Upgrade. Alle Dateien halten sich strikt an das Limit von **maximal 100 Zeilen**.

| Feature | Technologie-Stack | Code-Stelle / Schicht / Modul | Anmerkungen |
| :--- | :--- | :--- | :--- |
| **Animation State Engine** | React Hooks, JS Timing | `hooks/useAnimationTimeline.ts` | Kern-Logik für den Show-Ablauf und Zeit-Berechnungen. |
| **Stage Orchestration** | React, Modular Components | `App.tsx` & `components/Stage.tsx` | Zusammenbau der Show-Bühne aus modularen Komponenten. |
| **Canvas Feuerwerk-Engine** | HTML5 Canvas, Custom Hook | `components/FireworkEngine.tsx` <br> `hooks/useFireworkEngine.ts` | Physik und Rendering sind sauber in Hook und Component getrennt. |
| **Echtzeit-Settings UI** | React, Tailwind CSS | `components/SettingsPanel.tsx` | Kompaktes UI-Modul für Live-Parameter-Tuning. |
| **Sound Engine** | Web Audio API | `services/SoundEngine.ts` | Dienst für Audio-Assets und Wiedergabe. |
| **Dynamisches Team-Falling** | React State, Physics Logik | `hooks/useFallingMembers.ts` | Spezialisierter Hook für die Animation der Teamnamen. |
| **Branding & Greeting** | React (UI) | `components/Branding.tsx`, `Greeting.tsx` | Schlanke UI-Module für Logo und Texte. |
| **Intro & Audio-Setup** | AudioContext API | `hooks/useAudioInitializer.ts` | Logik für den interaktiven Show-Start. |

---

## Architektur-Schichten (Modularisiert)
Die Struktur wurde optimiert, um Lesbarkeit und Wartbarkeit zu maximieren. Keine Klasse überschreitet **100 Zeilen**.

1. **Logic Layer (Hooks)**: 
   - Zustandsverwaltung und Algorithmus-Logik (`hooks/*.ts`).
2. **Presentation Layer (Components)**: 
   - Visualisierungs-Logik und UI (`components/*.tsx`).
3. **Orchestration Layer (App)**: 
   - Die `App.tsx` als "Klebstoff" zwischen Logik und Darstellung.
4. **Service Layer**: 
   - Infrastruktur-Dienste wie Audio (`services/*.ts`).
5. **Configuration Layer**: 
   - Datenmodelle und Show-Parameter (`config.ts`, `types.ts`).
