import { useState, useEffect, useRef, useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Users,
  GitCompare,
  ChevronLeft,
  Upload,
  Eye,
  EyeOff,
  Star,
  Search,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
  Rows3,
  Shield,
  Sun,
  Moon,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react";

const ATTRS = [
  { key: "mechanics", label: "Mechanics" },
  { key: "laning", label: "Laning" },
  { key: "teamfighting", label: "Teamfighting" },
  { key: "macro_play", label: "Macro play" },
  { key: "consistency", label: "Consistency" },
  { key: "shotcalling", label: "Shotcalling" },
  { key: "champion_pool", label: "Champion pool" },
  { key: "discipline", label: "Discipline" },
  { key: "mental_resilience", label: "Mental resilience" },
];

const POSITIONS = ["Top", "Jungle", "Mid", "Adc", "Support"];

const SAVE_PATHS = [
  { os: "Windows", path: "%APPDATA%\\com.openleaguemanager.olmanager\\saves" },
  { os: "macOS", path: "~/Library/Application Support/com.openleaguemanager.olmanager/saves" },
  { os: "Linux", path: "~/.local/share/com.openleaguemanager.olmanager/saves" },
];

const POS_COLOR = {
  Top: "var(--pos-top)",
  Jungle: "var(--pos-jungle)",
  Mid: "var(--pos-mid)",
  Adc: "var(--pos-adc)",
  Support: "var(--pos-support)",
};

const ACCENT = "var(--accent)";
const COMPARE_COLORS = ["var(--cmp-1)", "var(--cmp-2)", "var(--cmp-3)", "var(--cmp-4)", "var(--cmp-5)"];
const MAX_COMPARE = 5;

const LOGO_VIEWBOX = "0 0 1541.53 533.7";

const LOGO_SVG_BLACK = `<defs>
    <style>
      .omlLogoBlack {
        fill: #262626;
      }
    </style>
  </defs>
  <path class="omlLogoBlack" d="M137.75,533.3l-126.78.15c-6.05,0-10.96-5.34-10.98-10.9l.23-144.92c0-4.56,8.77-9.66,12.83-10.68,7.47-1.88,13.18-8.45,13.21-17.59l.68-186.61c.1-28.09,9.85-54.65,25.52-76.36,24.21-33.54,60.5-51.59,101.7-51.58l185.29.03c9.75,0,14.16-5.42,16.56-14.65,1.86-7.15,7.77-19.85,17.1-19.87L506.67,0c6.63-.02,12.17,5.95,12.16,12.57l-.1,149.36c0,13.31-26.16,9.23-26.14,29.39l.16,178.86c.04,41.62-16.14,80.01-48.69,105.68-20.75,16.37-45.1,26.01-72.18,26.1l-192.52.64c-9.32.03-14.75,5.35-17.97,12.85,0,0-3.28,13.03-23.62,17.85ZM493.12,143.96l-.11-85.08-11.52-7.15c-9.8-6.08-14.55-15.05-18.7-26.73l-77.02.11c-2.67,0-6.86,6.78-7.7,8.98-8.74,31.65-1.35,63.91,19.39,89.23,21.1,26.39,54.93,38.89,87.74,30.51,4.31-1.1,7.92-4.87,7.91-9.88ZM266.57,238.6l7.15-8.43,87.56-87.72c3.43-3.44,6.44-9.21,7.94-13.79-8.92-14.67-15.44-29.47-18.84-45.89-1.38-6.7-5.79-7.45-11.94-7.44l-183.82.18c-12.81.01-29.21,3.23-30.65,9.8-.44,2,.56,7.06,1.76,8.79,12.75,18.3,22.89,37.08,29.39,58.26,4.52,14.72,14.73,24.35,29.84,27.9,39.17,9.2,55.94,29.11,81.6,58.35ZM127.88,375.06l100.5-101.39-29.19-29.21c-9.12-9.13-23.46-11.78-35.19-16.58-23.6-7.12-39.5-24.11-48.35-46.66l-13.13-33.44c-4.27-10.87-18.49-23.8-25.36-20.15-7.79,4.14-10.68,40.5-10.7,60.1l-.24,162.43c-.01,8.89,5.32,11.83,12.59,13.2,12.33,2.31,24.14,8.78,34.7,14.99,6.5,3.82,9.28,1.84,14.38-3.3ZM443.71,408.84c7.62-9.21,9.38-41.26,9.34-60.19l-.31-156.71c0-4.43-3.02-10.54-6.49-11.4-13.72-3.38-24.68-7.39-36.78-14.04-3.86-2.12-8.22-1.63-11.6,1.78l-100.86,102.02c9.43,11.14,17.75,21.31,28.92,30.26,23.69,18.98,58.95,13.66,77.69,58.47l12.64,30.24c6.34,15.16,22.22,25.89,27.45,19.57ZM393.85,456.77c4.65-2.67.97-11.82-1.41-14.91-12.64-16.44-21.67-33.35-27.82-52.95-4.24-13.51-14.61-23.32-28.27-27.14-33.64-10.15-53.64-28.19-76.88-54.76l-108.13,107.59c6.48,14.16,11.21,25.83,15.44,39.83.79,2.61,4.04,7.06,7.22,7.06l196.64.1c7.64,0,16.56-1.02,23.21-4.83ZM54.36,508.47l79.57-.75c2.04-.96,5.75-4.24,6.27-6.34,7.32-29.79.23-60.09-19.66-83.38-18.34-21.48-46.14-34.76-76.16-32.53-6.82.5-13.87,2.37-18.92,6.92l.06,76.13c.01,14.17,23.12,10.14,28.84,39.95Z"/>
  <g>
    <path class="omlLogoBlack" d="M642.09,491.05c-18.71,0-33.75-.63-45.11-1.87-11.36-1.25-19.96-3.56-25.8-6.95-5.84-3.39-9.76-8.2-11.76-14.44-2.01-6.24-3.01-14.35-3.01-24.33h24.59c0,5.61.4,10.14,1.2,13.57.8,3.43,3.07,6.06,6.82,7.89,3.74,1.83,9.82,3.07,18.25,3.74,8.42.67,20.25,1,35.49,1,16.13,0,28.67-.33,37.63-1,8.96-.67,15.39-1.91,19.31-3.74,3.92-1.82,6.3-4.48,7.15-7.95.85-3.47,1.27-8.06,1.27-13.77,0-6.95-.62-12.16-1.87-15.64-1.25-3.48-4.19-5.81-8.82-7.02-4.63-1.2-12.03-1.85-22.19-1.94l-61.22-.67c-15.77-.18-27.8-1.51-36.09-4.01-8.29-2.49-13.95-6.88-16.98-13.17-3.03-6.28-4.54-15.22-4.54-26.8,0-10.78,1.67-19.11,5.01-25,3.34-5.88,8.58-10.07,15.71-12.57,7.13-2.49,16.39-3.99,27.8-4.48,11.41-.49,25.17-.73,41.3-.73,18.98,0,34.06.58,45.25,1.74,11.18,1.16,19.56,3.34,25.13,6.55,5.57,3.21,9.22,7.87,10.96,13.97,1.74,6.11,2.61,14.06,2.61,23.86h-24.59c0-5.79-.4-10.36-1.2-13.7-.8-3.34-2.96-5.79-6.48-7.35-3.52-1.56-9.22-2.56-17.11-3.01-7.89-.45-18.96-.67-33.22-.67-16.22,0-28.83.18-37.83.53-9,.36-15.51,1.2-19.52,2.54-4.01,1.34-6.46,3.45-7.35,6.35-.89,2.9-1.34,6.88-1.34,11.96s.29,9.25.87,12.23c.58,2.99,2.12,5.24,4.61,6.75,2.49,1.52,6.57,2.52,12.23,3.01,5.66.49,13.57.78,23.73.87l52.8.53c15.86.18,27.91,1.49,36.16,3.94,8.24,2.45,13.86,6.95,16.84,13.5,2.98,6.55,4.48,16.02,4.48,28.4,0,11.14-1.63,19.92-4.88,26.33-3.25,6.42-8.44,11.16-15.57,14.24-7.13,3.07-16.51,5.06-28.14,5.95-11.63.89-25.82,1.34-42.57,1.34Z"/>
    <path class="omlLogoBlack" d="M857.43,491.05c-17.2,0-31.81-.87-43.84-2.61-12.03-1.74-21.74-5.3-29.14-10.69-7.4-5.39-12.79-13.48-16.17-24.26-3.39-10.78-5.08-25.17-5.08-43.17s1.69-31.46,5.08-41.97c3.39-10.51,8.78-18.45,16.17-23.79,7.4-5.35,17.11-8.91,29.14-10.69,12.03-1.78,26.64-2.67,43.84-2.67,20.58,0,37.54,1.18,50.86,3.54,13.32,2.36,23.19,7.2,29.61,14.5,6.42,7.31,9.62,18.45,9.62,33.42h-24.59c0-8.64-1.78-15.1-5.35-19.38-3.57-4.28-10.07-7.13-19.52-8.55-9.45-1.42-22.99-2.14-40.63-2.14-15.86,0-28.43.67-37.69,2.01-9.27,1.34-16.09,3.94-20.45,7.82-4.37,3.88-7.2,9.65-8.49,17.31-1.29,7.67-1.94,17.87-1.94,30.61s.65,23.75,1.94,31.68c1.29,7.93,4.12,13.88,8.49,17.84,4.37,3.97,11.18,6.6,20.45,7.89,9.27,1.29,21.83,1.94,37.69,1.94,13.45,0,24.46-.38,33.01-1.14,8.55-.76,15.19-2.27,19.92-4.55,4.72-2.27,8-5.57,9.82-9.89,1.83-4.32,2.74-10.09,2.74-17.31h24.59c0,11.94-1.78,21.52-5.35,28.74-3.56,7.22-9,12.65-16.31,16.31-7.31,3.66-16.64,6.11-28,7.35-11.36,1.25-24.84,1.87-40.43,1.87Z"/>
    <path class="omlLogoBlack" d="M1067.42,491.05c-17.2,0-31.81-.87-43.84-2.61-12.03-1.74-21.74-5.3-29.14-10.69-7.4-5.39-12.79-13.48-16.17-24.26-3.39-10.78-5.08-25.17-5.08-43.17s1.69-31.46,5.08-41.97c3.39-10.51,8.78-18.45,16.17-23.79,7.39-5.35,17.11-8.91,29.14-10.69,12.03-1.78,26.64-2.67,43.84-2.67s31.92.89,43.91,2.67c11.98,1.78,21.68,5.35,29.07,10.69,7.4,5.35,12.79,13.28,16.17,23.79,3.39,10.52,5.08,24.51,5.08,41.97s-1.69,32.39-5.08,43.17c-3.39,10.78-8.78,18.87-16.17,24.26-7.4,5.39-17.09,8.96-29.07,10.69-11.99,1.74-26.62,2.61-43.91,2.61ZM1135.99,410.31c0-12.74-.65-22.94-1.94-30.61-1.29-7.66-4.12-13.43-8.49-17.31-4.37-3.88-11.16-6.48-20.38-7.82-9.22-1.34-21.81-2.01-37.76-2.01s-28.43.67-37.69,2.01c-9.27,1.34-16.09,3.94-20.45,7.82-4.37,3.88-7.2,9.65-8.49,17.31-1.29,7.67-1.94,17.87-1.94,30.61s.65,23.75,1.94,31.68c1.29,7.93,4.12,13.88,8.49,17.84,4.36,3.97,11.18,6.6,20.45,7.89,9.27,1.29,21.83,1.94,37.69,1.94s28.54-.65,37.76-1.94c9.22-1.29,16.02-3.92,20.38-7.89,4.36-3.96,7.2-9.91,8.49-17.84,1.29-7.93,1.94-18.49,1.94-31.68Z"/>
    <path class="omlLogoBlack" d="M1270.72,491.05c-20.14,0-36-2.21-47.58-6.62-11.59-4.41-19.83-11.81-24.73-22.19-4.9-10.38-7.35-24.57-7.35-42.57v-85.55h25.8v85.55c0,10.16.82,18.51,2.47,25.06,1.65,6.55,4.57,11.63,8.75,15.24,4.19,3.61,10.09,6.13,17.71,7.55,7.62,1.43,17.44,2.14,29.47,2.14,17.82,0,31.81-1.47,41.97-4.41,10.16-2.94,17.35-7.55,21.59-13.83,4.23-6.28,6.35-14.46,6.35-24.53v-92.76h25.66v153.98h-25.66v-20.45c-3.74,5.17-8.47,9.49-14.17,12.97-5.7,3.48-13.32,6.08-22.86,7.82-9.54,1.74-22.01,2.61-37.43,2.61Z"/>
    <path class="omlLogoBlack" d="M1476.84,488.11c-15.68,0-28.25-1.58-37.69-4.75-9.45-3.16-16.29-8.78-20.52-16.84-4.23-8.06-6.35-19.4-6.35-34.02v-140.48h25.66v42.1h94.77v21.12h-94.77v77.26c0,9.98.91,17.42,2.74,22.32,1.83,4.9,5.52,8.11,11.09,9.62,5.57,1.52,13.92,2.27,25.06,2.27,9.89,0,17.66-.31,23.33-.94,5.66-.62,9.82-2.29,12.5-5.01,2.67-2.72,4.36-7.2,5.08-13.43.71-6.24,1.07-15.02,1.07-26.33h22.72c0,14.79-.92,26.64-2.74,35.55-1.83,8.91-5.08,15.64-9.76,20.18s-11.23,7.58-19.65,9.09c-8.42,1.52-19.27,2.27-32.55,2.27Z"/>
  </g>
  <rect class="omlLogoBlack" x="1160.03" y="461.1" width="21.25" height="76.25" transform="translate(-10.13 974) rotate(-45)"/>
  <path class="omlLogoBlack" d="M1038.57,375.05c1.71-.03,3.72.69,6.02,2.17,1.4.89,3.01,2.06,4.84,3.52.84.67,2.06.56,2.76-.25l1.47-1.7c.74-.86.61-2.18-.28-2.88-2.23-1.76-4.29-3.24-6.2-4.44-3.01-1.9-5.84-2.97-8.5-3.19-2.66-.23-5.37.5-8.12,2.19-2.76,1.69-5.8,4.46-9.13,8.34-3.43,3.99-5.8,7.5-7.11,10.53-1.31,3.04-1.66,5.85-1.05,8.47.61,2.6,2.08,5.24,4.42,7.93,1.48,1.7,3.25,3.52,5.32,5.46.83.78,2.15.71,2.89-.15l1.47-1.7c.7-.82.63-2.04-.16-2.78-1.72-1.59-3.12-3.01-4.21-4.25-1.81-2.06-2.81-3.94-3.03-5.65-.21-1.71.3-3.57,1.53-5.58,1.22-2,3.1-4.47,5.61-7.39s4.52-4.96,6.27-6.42c1.75-1.45,3.48-2.19,5.18-2.21Z"/>
  <g>
    <path class="omlLogoBlack" d="M605.07,292.38c-8.92,0-17.1-2.16-24.54-6.49-7.44-4.32-13.32-10.2-17.64-17.64-4.33-7.43-6.49-15.61-6.49-24.53V49.07c0-8.92,2.16-17.1,6.49-24.53,4.32-7.43,10.2-13.31,17.64-17.64,7.43-4.32,15.61-6.49,24.54-6.49h194.65c8.92,0,17.1,2.17,24.53,6.49,7.43,4.33,13.31,10.21,17.64,17.64,4.32,7.44,6.49,15.61,6.49,24.53v194.65c0,8.92-2.17,17.1-6.49,24.53-4.33,7.44-10.21,13.32-17.64,17.64-7.44,4.33-15.61,6.49-24.53,6.49h-194.65ZM605.07,259.53h194.65c4.32,0,8.04-1.55,11.15-4.66,3.11-3.11,4.66-6.82,4.66-11.15V49.07c0-4.32-1.56-8.04-4.66-11.15-3.11-3.11-6.83-4.67-11.15-4.67h-194.65c-4.33,0-8.05,1.56-11.15,4.67-3.11,3.11-4.66,6.83-4.66,11.15v194.65c0,4.33,1.55,8.05,4.66,11.15,3.11,3.11,6.82,4.66,11.15,4.66Z"/>
    <path class="omlLogoBlack" d="M893.39,288.41V3.97c0-2.19,1.78-3.97,3.97-3.97h24.91c2.19,0,3.97,1.78,3.97,3.97v251.59c0,2.19,1.78,3.97,3.97,3.97h251.18c2.19,0,3.97,1.78,3.97,3.97v24.91c0,2.19-1.78,3.97-3.97,3.97h-284.03c-2.19,0-3.97-1.78-3.97-3.97Z"/>
    <path class="omlLogoBlack" d="M1208.88,288.41V4.38c0-2.19,1.78-3.97,3.97-3.97h39.19c1.17,0,2.29.52,3.04,1.42l117.02,139.33c1.59,1.89,4.49,1.89,6.08,0L1495.21,1.82c.75-.9,1.87-1.42,3.04-1.42h39.19c2.19,0,3.97,1.78,3.97,3.97v284.03c0,2.19-1.78,3.97-3.97,3.97h-24.91c-2.19,0-3.97-1.78-3.97-3.97V48.6c0-3.7-4.62-5.39-7.01-2.56l-123.37,146.62c-1.59,1.89-4.49,1.89-6.08,0l-123.37-146.62c-2.39-2.83-7.01-1.15-7.01,2.56v239.81c0,2.19-1.78,3.97-3.97,3.97h-24.91c-2.19,0-3.97-1.78-3.97-3.97Z"/>
  </g>`;

const LOGO_SVG_WHITE = `<defs>
    <style>
      .omlLogoWhite {
        fill: #fff;
      }
    </style>
  </defs>
  <g id="Ebene_1">
    <g>
      <path class="omlLogoWhite" d="M137.75,533.3l-126.78.15c-6.05,0-10.96-5.34-10.98-10.9l.23-144.92c0-4.56,8.77-9.66,12.83-10.68,7.47-1.88,13.18-8.45,13.21-17.59l.68-186.61c.1-28.09,9.85-54.65,25.52-76.36,24.21-33.54,60.5-51.59,101.7-51.58l185.29.03c9.75,0,14.16-5.42,16.56-14.65,1.86-7.15,7.77-19.85,17.1-19.87L506.67,0c6.63-.02,12.17,5.95,12.16,12.57l-.1,149.36c0,13.31-26.16,9.23-26.14,29.39l.16,178.86c.04,41.62-16.14,80.01-48.69,105.68-20.75,16.37-45.1,26.01-72.18,26.1l-192.52.64c-9.32.03-14.75,5.35-17.97,12.85,0,0-3.28,13.03-23.62,17.85ZM493.12,143.96l-.11-85.08-11.52-7.15c-9.8-6.08-14.55-15.05-18.7-26.73l-77.02.11c-2.67,0-6.86,6.78-7.7,8.98-8.74,31.65-1.35,63.91,19.39,89.23,21.1,26.39,54.93,38.89,87.74,30.51,4.31-1.1,7.92-4.87,7.91-9.88ZM266.57,238.6l7.15-8.43,87.56-87.72c3.43-3.44,6.44-9.21,7.94-13.79-8.92-14.67-15.44-29.47-18.84-45.89-1.38-6.7-5.79-7.45-11.94-7.44l-183.82.18c-12.81.01-29.21,3.23-30.65,9.8-.44,2,.56,7.06,1.76,8.79,12.75,18.3,22.89,37.08,29.39,58.26,4.52,14.72,14.73,24.35,29.84,27.9,39.17,9.2,55.94,29.11,81.6,58.35ZM127.88,375.06l100.5-101.39-29.19-29.21c-9.12-9.13-23.46-11.78-35.19-16.58-23.6-7.12-39.5-24.11-48.35-46.66l-13.13-33.44c-4.27-10.87-18.49-23.8-25.36-20.15-7.79,4.14-10.68,40.5-10.7,60.1l-.24,162.43c-.01,8.89,5.32,11.83,12.59,13.2,12.33,2.31,24.14,8.78,34.7,14.99,6.5,3.82,9.28,1.84,14.38-3.3ZM443.71,408.84c7.62-9.21,9.38-41.26,9.34-60.19l-.31-156.71c0-4.43-3.02-10.54-6.49-11.4-13.72-3.38-24.68-7.39-36.78-14.04-3.86-2.12-8.22-1.63-11.6,1.78l-100.86,102.02c9.43,11.14,17.75,21.31,28.92,30.26,23.69,18.98,58.95,13.66,77.69,58.47l12.64,30.24c6.34,15.16,22.22,25.89,27.45,19.57ZM393.85,456.77c4.65-2.67.97-11.82-1.41-14.91-12.64-16.44-21.67-33.35-27.82-52.95-4.24-13.51-14.61-23.32-28.27-27.14-33.64-10.15-53.64-28.19-76.88-54.76l-108.13,107.59c6.48,14.16,11.21,25.83,15.44,39.83.79,2.61,4.04,7.06,7.22,7.06l196.64.1c7.64,0,16.56-1.02,23.21-4.83ZM54.36,508.47l79.57-.75c2.04-.96,5.75-4.24,6.27-6.34,7.32-29.79.23-60.09-19.66-83.38-18.34-21.48-46.14-34.76-76.16-32.53-6.82.5-13.87,2.37-18.92,6.92l.06,76.13c.01,14.17,23.12,10.14,28.84,39.95Z"/>
      <g>
        <path class="omlLogoWhite" d="M642.09,491.05c-18.71,0-33.75-.63-45.11-1.87-11.36-1.25-19.96-3.56-25.8-6.95-5.84-3.39-9.76-8.2-11.76-14.44-2.01-6.24-3.01-14.35-3.01-24.33h24.59c0,5.61.4,10.14,1.2,13.57.8,3.43,3.07,6.06,6.82,7.89,3.74,1.83,9.82,3.07,18.25,3.74,8.42.67,20.25,1,35.49,1,16.13,0,28.67-.33,37.63-1,8.96-.67,15.39-1.91,19.31-3.74,3.92-1.82,6.3-4.48,7.15-7.95.85-3.47,1.27-8.06,1.27-13.77,0-6.95-.62-12.16-1.87-15.64-1.25-3.48-4.19-5.81-8.82-7.02-4.63-1.2-12.03-1.85-22.19-1.94l-61.22-.67c-15.77-.18-27.8-1.51-36.09-4.01-8.29-2.49-13.95-6.88-16.98-13.17-3.03-6.28-4.54-15.22-4.54-26.8,0-10.78,1.67-19.11,5.01-25,3.34-5.88,8.58-10.07,15.71-12.57,7.13-2.49,16.39-3.99,27.8-4.48,11.41-.49,25.17-.73,41.3-.73,18.98,0,34.06.58,45.25,1.74,11.18,1.16,19.56,3.34,25.13,6.55,5.57,3.21,9.22,7.87,10.96,13.97,1.74,6.11,2.61,14.06,2.61,23.86h-24.59c0-5.79-.4-10.36-1.2-13.7-.8-3.34-2.96-5.79-6.48-7.35-3.52-1.56-9.22-2.56-17.11-3.01-7.89-.45-18.96-.67-33.22-.67-16.22,0-28.83.18-37.83.53-9,.36-15.51,1.2-19.52,2.54-4.01,1.34-6.46,3.45-7.35,6.35-.89,2.9-1.34,6.88-1.34,11.96s.29,9.25.87,12.23c.58,2.99,2.12,5.24,4.61,6.75,2.49,1.52,6.57,2.52,12.23,3.01,5.66.49,13.57.78,23.73.87l52.8.53c15.86.18,27.91,1.49,36.16,3.94,8.24,2.45,13.86,6.95,16.84,13.5,2.98,6.55,4.48,16.02,4.48,28.4,0,11.14-1.63,19.92-4.88,26.33-3.25,6.42-8.44,11.16-15.57,14.24-7.13,3.07-16.51,5.06-28.14,5.95-11.63.89-25.82,1.34-42.57,1.34Z"/>
        <path class="omlLogoWhite" d="M857.43,491.05c-17.2,0-31.81-.87-43.84-2.61-12.03-1.74-21.74-5.3-29.14-10.69-7.4-5.39-12.79-13.48-16.17-24.26-3.39-10.78-5.08-25.17-5.08-43.17s1.69-31.46,5.08-41.97c3.39-10.51,8.78-18.45,16.17-23.79,7.4-5.35,17.11-8.91,29.14-10.69,12.03-1.78,26.64-2.67,43.84-2.67,20.58,0,37.54,1.18,50.86,3.54,13.32,2.36,23.19,7.2,29.61,14.5,6.42,7.31,9.62,18.45,9.62,33.42h-24.59c0-8.64-1.78-15.1-5.35-19.38-3.57-4.28-10.07-7.13-19.52-8.55-9.45-1.42-22.99-2.14-40.63-2.14-15.86,0-28.43.67-37.69,2.01-9.27,1.34-16.09,3.94-20.45,7.82-4.37,3.88-7.2,9.65-8.49,17.31-1.29,7.67-1.94,17.87-1.94,30.61s.65,23.75,1.94,31.68c1.29,7.93,4.12,13.88,8.49,17.84,4.37,3.97,11.18,6.6,20.45,7.89,9.27,1.29,21.83,1.94,37.69,1.94,13.45,0,24.46-.38,33.01-1.14,8.55-.76,15.19-2.27,19.92-4.55,4.72-2.27,8-5.57,9.82-9.89,1.83-4.32,2.74-10.09,2.74-17.31h24.59c0,11.94-1.78,21.52-5.35,28.74-3.56,7.22-9,12.65-16.31,16.31-7.31,3.66-16.64,6.11-28,7.35-11.36,1.25-24.84,1.87-40.43,1.87Z"/>
        <path class="omlLogoWhite" d="M1067.42,491.05c-17.2,0-31.81-.87-43.84-2.61-12.03-1.74-21.74-5.3-29.14-10.69-7.4-5.39-12.79-13.48-16.17-24.26-3.39-10.78-5.08-25.17-5.08-43.17s1.69-31.46,5.08-41.97c3.39-10.51,8.78-18.45,16.17-23.79,7.39-5.35,17.11-8.91,29.14-10.69,12.03-1.78,26.64-2.67,43.84-2.67s31.92.89,43.91,2.67c11.98,1.78,21.68,5.35,29.07,10.69,7.4,5.35,12.79,13.28,16.17,23.79,3.39,10.52,5.08,24.51,5.08,41.97s-1.69,32.39-5.08,43.17c-3.39,10.78-8.78,18.87-16.17,24.26-7.4,5.39-17.09,8.96-29.07,10.69-11.99,1.74-26.62,2.61-43.91,2.61ZM1135.99,410.31c0-12.74-.65-22.94-1.94-30.61-1.29-7.66-4.12-13.43-8.49-17.31-4.37-3.88-11.16-6.48-20.38-7.82-9.22-1.34-21.81-2.01-37.76-2.01s-28.43.67-37.69,2.01c-9.27,1.34-16.09,3.94-20.45,7.82-4.37,3.88-7.2,9.65-8.49,17.31-1.29,7.67-1.94,17.87-1.94,30.61s.65,23.75,1.94,31.68c1.29,7.93,4.12,13.88,8.49,17.84,4.36,3.97,11.18,6.6,20.45,7.89,9.27,1.29,21.83,1.94,37.69,1.94s28.54-.65,37.76-1.94c9.22-1.29,16.02-3.92,20.38-7.89,4.36-3.96,7.2-9.91,8.49-17.84,1.29-7.93,1.94-18.49,1.94-31.68Z"/>
        <path class="omlLogoWhite" d="M1270.72,491.05c-20.14,0-36-2.21-47.58-6.62-11.59-4.41-19.83-11.81-24.73-22.19-4.9-10.38-7.35-24.57-7.35-42.57v-85.55h25.8v85.55c0,10.16.82,18.51,2.47,25.06,1.65,6.55,4.57,11.63,8.75,15.24,4.19,3.61,10.09,6.13,17.71,7.55,7.62,1.43,17.44,2.14,29.47,2.14,17.82,0,31.81-1.47,41.97-4.41,10.16-2.94,17.35-7.55,21.59-13.83,4.23-6.28,6.35-14.46,6.35-24.53v-92.76h25.66v153.98h-25.66v-20.45c-3.74,5.17-8.47,9.49-14.17,12.97-5.7,3.48-13.32,6.08-22.86,7.82-9.54,1.74-22.01,2.61-37.43,2.61Z"/>
        <path class="omlLogoWhite" d="M1476.84,488.11c-15.68,0-28.25-1.58-37.69-4.75-9.45-3.16-16.29-8.78-20.52-16.84-4.23-8.06-6.35-19.4-6.35-34.02v-140.48h25.66v42.1h94.77v21.12h-94.77v77.26c0,9.98.91,17.42,2.74,22.32,1.83,4.9,5.52,8.11,11.09,9.62,5.57,1.52,13.92,2.27,25.06,2.27,9.89,0,17.66-.31,23.33-.94,5.66-.62,9.82-2.29,12.5-5.01,2.67-2.72,4.36-7.2,5.08-13.43.71-6.24,1.07-15.02,1.07-26.33h22.72c0,14.79-.92,26.64-2.74,35.55-1.83,8.91-5.08,15.64-9.76,20.18s-11.23,7.58-19.65,9.09c-8.42,1.52-19.27,2.27-32.55,2.27Z"/>
      </g>
      <rect class="omlLogoWhite" x="1160.03" y="461.1" width="21.25" height="76.25" transform="translate(-10.13 974) rotate(-45)"/>
      <path class="omlLogoWhite" d="M1038.57,375.05c1.71-.03,3.72.69,6.02,2.17,1.4.89,3.01,2.06,4.84,3.52.84.67,2.06.56,2.76-.25l1.47-1.7c.74-.86.61-2.18-.28-2.88-2.23-1.76-4.29-3.24-6.2-4.44-3.01-1.9-5.84-2.97-8.5-3.19-2.66-.23-5.37.5-8.12,2.19-2.76,1.69-5.8,4.46-9.13,8.34-3.43,3.99-5.8,7.5-7.11,10.53-1.31,3.04-1.66,5.85-1.05,8.47.61,2.6,2.08,5.24,4.42,7.93,1.48,1.7,3.25,3.52,5.32,5.46.83.78,2.15.71,2.89-.15l1.47-1.7c.7-.82.63-2.04-.16-2.78-1.72-1.59-3.12-3.01-4.21-4.25-1.81-2.06-2.81-3.94-3.03-5.65-.21-1.71.3-3.57,1.53-5.58s3.1-4.47,5.61-7.39c2.44-2.83,4.52-4.96,6.27-6.42,1.75-1.45,3.48-2.19,5.18-2.21Z"/>
      <g>
        <path class="omlLogoWhite" d="M605.07,292.38c-8.92,0-17.1-2.16-24.54-6.49-7.44-4.32-13.32-10.2-17.64-17.64-4.33-7.43-6.49-15.61-6.49-24.53V49.07c0-8.92,2.16-17.1,6.49-24.53,4.32-7.43,10.2-13.31,17.64-17.64,7.43-4.32,15.61-6.49,24.54-6.49h194.65c8.92,0,17.1,2.17,24.53,6.49,7.43,4.33,13.31,10.21,17.64,17.64,4.32,7.44,6.49,15.61,6.49,24.53v194.65c0,8.92-2.17,17.1-6.49,24.53-4.33,7.44-10.21,13.32-17.64,17.64-7.44,4.33-15.61,6.49-24.53,6.49h-194.65ZM605.07,259.53h194.65c4.32,0,8.04-1.55,11.15-4.66,3.11-3.11,4.66-6.82,4.66-11.15V49.07c0-4.32-1.56-8.04-4.66-11.15-3.11-3.11-6.83-4.67-11.15-4.67h-194.65c-4.33,0-8.05,1.56-11.15,4.67-3.11,3.11-4.66,6.83-4.66,11.15v194.65c0,4.33,1.55,8.05,4.66,11.15,3.11,3.11,6.82,4.66,11.15,4.66Z"/>
        <path class="omlLogoWhite" d="M893.39,288.41V3.97c0-2.19,1.78-3.97,3.97-3.97h24.91c2.19,0,3.97,1.78,3.97,3.97v251.59c0,2.19,1.78,3.97,3.97,3.97h251.18c2.19,0,3.97,1.78,3.97,3.97v24.91c0,2.19-1.78,3.97-3.97,3.97h-284.03c-2.19,0-3.97-1.78-3.97-3.97Z"/>
        <path class="omlLogoWhite" d="M1208.88,288.41V4.38c0-2.19,1.78-3.97,3.97-3.97h39.19c1.17,0,2.29.52,3.04,1.42l117.02,139.33c1.59,1.89,4.49,1.89,6.08,0L1495.21,1.82c.75-.9,1.87-1.42,3.04-1.42h39.19c2.19,0,3.97,1.78,3.97,3.97v284.03c0,2.19-1.78,3.97-3.97,3.97h-24.91c-2.19,0-3.97-1.78-3.97-3.97V48.6c0-3.7-4.62-5.39-7.01-2.56l-123.37,146.62c-1.59,1.89-4.49,1.89-6.08,0l-123.37-146.62c-2.39-2.83-7.01-1.15-7.01,2.56v239.81c0,2.19-1.78,3.97-3.97,3.97h-24.91c-2.19,0-3.97-1.78-3.97-3.97Z"/>
      </g>
    </g>
  </g>`;

function OMLLogo({ mode, height = 26 }) {
  const svg = mode === "dark" ? LOGO_SVG_WHITE : LOGO_SVG_BLACK;
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      style={{ height, width: "auto", display: "block" }}
      role="img"
      aria-label="OLM"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function FlagImg({ code, size = 16 }) {
  const [failed, setFailed] = useState(false);
  if (!code || code.length !== 2 || failed) {
    return <span style={{ fontSize: "11px", color: "var(--text-faint)" }}>{code || "—"}</span>;
  }
  const h = size;
  const w = Math.round(size * 1.33);
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt={code}
      title={code}
      width={w}
      height={h}
      style={{ objectFit: "cover", verticalAlign: "middle", flexShrink: 0 }}
      onError={() => setFailed(true)}
    />
  );
}

function SaveLocationHelp() {
  const [open, setOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  async function copyPath(path, idx) {
    try {
      await navigator.clipboard.writeText(path);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch (e) {
      // clipboard API unavailable — the path is still visible to select/copy manually
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        className="rr-icon-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Where's my save file?"
        aria-expanded={open}
        title="Where's my save file?"
      >
        <HelpCircle size={15} />
      </button>
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
            aria-hidden="true"
          />
          <div
            className="rr-card"
            style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, width: "340px", zIndex: 50, padding: "14px" }}
          >
            <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 4px" }}>Where's my save?</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 12px" }}>
              A browser can't jump a file picker to a folder automatically — but you can copy the path below and paste it into the picker's address bar to get there instantly.
            </p>
            {SAVE_PATHS.map((p, i) => (
              <div key={p.os} style={{ marginBottom: i < SAVE_PATHS.length - 1 ? "10px" : 0 }}>
                <div style={{ fontSize: "11px", color: "var(--text-faint)", marginBottom: "3px" }}>{p.os}</div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <code style={{ flex: 1, fontSize: "11px", background: "var(--surface-alt)", padding: "6px 8px", overflowX: "auto", whiteSpace: "nowrap", color: "var(--text)" }}>
                    {p.path}
                  </code>
                  <button
                    className="rr-icon-btn"
                    onClick={() => copyPath(p.path, i)}
                    aria-label={`Copy ${p.os} save path`}
                    style={{ flexShrink: 0 }}
                  >
                    {copiedIdx === i ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function normalizePosition(pos) {
  if (!pos) return "Mid";
  const s = String(pos).toLowerCase();
  if (s.startsWith("top")) return "Top";
  if (s.startsWith("jung")) return "Jungle";
  if (s.startsWith("mid")) return "Mid";
  if (s === "adc" || s.startsWith("bot")) return "Adc";
  if (s.startsWith("sup")) return "Support";
  return pos;
}

function overall(player) {
  if (typeof player.lol_ovr === "number") return player.lol_ovr;
  const vals = ATTRS.map((a) => Number(player.attributes[a.key]) || 0);
  return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
}

function age(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d)) return null;
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

function emptyForm() {
  return {
    match_name: "",
    full_name: "",
    date_of_birth: "",
    nationality: "",
    position: "Mid",
    team_id: "",
    team_name: "",
    wage: "",
    market_value: "",
    potential_base: "",
    potential_revealed: "",
    attributes: {
      mechanics: 50,
      laning: 50,
      teamfighting: 50,
      macro_play: 50,
      consistency: 50,
      shotcalling: 50,
      champion_pool: 50,
      discipline: 50,
      mental_resilience: 50,
    },
  };
}

function radarData(player) {
  return ATTRS.map((a) => ({ attribute: a.label, value: Number(player.attributes[a.key]) || 0 }));
}

function compareData(players) {
  return ATTRS.map((a) => {
    const row = { attribute: a.label };
    players.forEach((p, i) => (row[`p${i}`] = Number(p.attributes[a.key]) || 0));
    return row;
  });
}

function potentialValue(p, revealHidden) {
  if (typeof p.potential_revealed === "number") return p.potential_revealed;
  if (revealHidden && typeof p.potential_base === "number" && p.potential_base > 0) return p.potential_base;
  return null;
}

async function parseImportFile(file) {
  const buf = await file.arrayBuffer();
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".olsave")) {
    if (typeof DecompressionStream === "undefined") {
      throw new Error("This browser doesn't support in-browser gzip decompression. Try a recent Chrome, Edge, or Firefox.");
    }
    const bytes = new Uint8Array(buf);
    const gzipBytes = bytes.slice(4);
    const stream = new Blob([gzipBytes]).stream().pipeThrough(new DecompressionStream("gzip"));
    const text = await new Response(stream).text();
    return { data: JSON.parse(text), kind: "save" };
  }
  const text = new TextDecoder("utf-8").decode(buf);
  return { data: JSON.parse(text), kind: "world" };
}

function mapTeams(data) {
  return (data.teams || []).map((t) => ({
    id: t.id,
    name: t.name,
    team_kind: t.team_kind || null,
    competition_id: t.competition_id || null,
    country: t.country || null,
  }));
}

function mapPlayers(data, teamMap) {
  return (data.players || []).map((p) => ({
    id: p.id,
    match_name: p.match_name,
    full_name: p.full_name || "",
    date_of_birth: p.date_of_birth || "",
    nationality: p.nationality || "",
    position: normalizePosition(p.position),
    team_id: p.team_id || "",
    team_name: teamMap[p.team_id] || "",
    wage: p.wage ?? "",
    market_value: p.market_value ?? "",
    condition: p.condition ?? null,
    morale: p.morale ?? null,
    fitness: p.fitness ?? null,
    contract_end: p.contract_end || null,
    lol_ovr: typeof p.lol_ovr === "number" ? p.lol_ovr : null,
    potential_base: typeof p.potential_base === "number" ? p.potential_base : null,
    potential_revealed: typeof p.potential_revealed === "number" ? p.potential_revealed : null,
    attributes: { ...p.attributes },
  }));
}

const PLAYERS_KEY = "rift-room-players";
const TEAMS_KEY = "rift-room-teams";
const WORLD_KEY = "rift-room-world-meta";
const PREFS_KEY = "rift-room-prefs-v2";
const FAVORITES_KEY = "rift-room-favorites";
const MODE_KEY = "rift-room-theme-mode";

const SORT_OPTIONS = [
  { key: "overall", label: "Overall" },
  { key: "potential", label: "Potential" },
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "market_value", label: "Market value" },
  { key: "wage", label: "Wage" },
  { key: "team", label: "Team" },
  ...ATTRS.map((a) => ({ key: a.key, label: a.label })),
];

export default function RiftRoom() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [worldMeta, setWorldMeta] = useState(null);
  const [myTeamId, setMyTeamId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [mode, setMode] = useState("dark");
  const [revealHidden, setRevealHidden] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("squad");
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [saveError, setSaveError] = useState(false);
  const [importMsg, setImportMsg] = useState(null);
  const [importing, setImporting] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const [teamFilter, setTeamFilter] = useState("all");
  const [leagueFilter, setLeagueFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [squadSearch, setSquadSearch] = useState("");
  const [sortKey, setSortKey] = useState("overall");
  const [sortDir, setSortDir] = useState("desc");
  const [viewMode, setViewMode] = useState("table");
  const [compareSearch, setCompareSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(80);

  const fileInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const p = await window.storage.get(PLAYERS_KEY, false);
        if (p?.value) setPlayers(JSON.parse(p.value));
      } catch (e) {}
      try {
        const t = await window.storage.get(TEAMS_KEY, false);
        if (t?.value) setTeams(JSON.parse(t.value));
      } catch (e) {}
      try {
        const w = await window.storage.get(WORLD_KEY, false);
        if (w?.value) {
          const parsed = JSON.parse(w.value);
          setWorldMeta(parsed);
          if (parsed.myTeamId) {
            setMyTeamId(parsed.myTeamId);
            setTeamFilter(parsed.myTeamId);
          }
        }
      } catch (e) {}
      try {
        const pr = await window.storage.get(PREFS_KEY, false);
        if (pr?.value) {
          const prefs = JSON.parse(pr.value);
          setRevealHidden(prefs.revealHidden || false);
          setViewMode(prefs.viewMode || "table");
        }
      } catch (e) {}
      try {
        const fav = await window.storage.get(FAVORITES_KEY, false);
        if (fav?.value) setFavorites(JSON.parse(fav.value));
      } catch (e) {}
      try {
        const m = await window.storage.get(MODE_KEY, false);
        if (m?.value) setMode(JSON.parse(m.value));
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        const r1 = await window.storage.set(PLAYERS_KEY, JSON.stringify(players), false);
        const r2 = await window.storage.set(TEAMS_KEY, JSON.stringify(teams), false);
        const r3 = worldMeta ? await window.storage.set(WORLD_KEY, JSON.stringify(worldMeta), false) : true;
        const r4 = await window.storage.set(PREFS_KEY, JSON.stringify({ revealHidden, viewMode }), false);
        const r5 = await window.storage.set(FAVORITES_KEY, JSON.stringify(favorites), false);
        const r6 = await window.storage.set(MODE_KEY, JSON.stringify(mode), false);
        setSaveError(!r1 || !r2 || !r3 || !r4 || !r5 || !r6);
      } catch (e) {
        setSaveError(true);
      }
    })();
  }, [players, teams, worldMeta, revealHidden, viewMode, favorites, mode, loaded]);

  useEffect(() => {
    document.body.style.background = mode === "dark" ? "#0c0e12" : "#f6f7f9";
  }, [mode]);

  function toggleFavorite(id) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }

  function startAdd() {
    setForm(emptyForm());
    setEditingId(null);
    setTab("add");
  }

  function startEdit(player) {
    setForm({
      match_name: player.match_name,
      full_name: player.full_name || "",
      date_of_birth: player.date_of_birth || "",
      nationality: player.nationality || "",
      position: player.position,
      team_id: player.team_id || "",
      team_name: player.team_name || "",
      wage: player.wage ?? "",
      market_value: player.market_value ?? "",
      potential_base: player.potential_base ?? "",
      potential_revealed: player.potential_revealed ?? "",
      attributes: { ...player.attributes },
    });
    setEditingId(player.id);
    setTab("add");
  }

  function deletePlayer(id) {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setCompareIds((prev) => prev.filter((cid) => cid !== id));
    setFavorites((prev) => prev.filter((f) => f !== id));
  }

  function submitForm(e) {
    e.preventDefault();
    if (!form.match_name.trim()) return;
    const teamName = teams.find((t) => t.id === form.team_id)?.name || form.team_name || "";
    const payload = {
      ...form,
      team_name: teamName,
      potential_base: form.potential_base === "" ? null : Number(form.potential_base),
      potential_revealed: form.potential_revealed === "" ? null : Number(form.potential_revealed),
    };
    if (editingId) {
      setPlayers((prev) => prev.map((p) => (p.id === editingId ? { ...payload, id: editingId } : p)));
    } else {
      setPlayers((prev) => [...prev, { ...payload, id: "custom-" + Date.now().toString() }]);
    }
    setTab("squad");
    setForm(emptyForm());
    setEditingId(null);
  }

  function toggleCompare(id) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setImportMsg(null);
    try {
      const { data, kind } = await parseImportFile(file);
      const importedTeams = mapTeams(data);
      const teamMap = {};
      importedTeams.forEach((t) => (teamMap[t.id] = t.name));
      const importedPlayers = mapPlayers(data, teamMap);

      setTeams((prev) => {
        const merged = [...prev];
        importedTeams.forEach((t) => {
          const idx = merged.findIndex((m) => m.id === t.id);
          if (idx >= 0) merged[idx] = t;
          else merged.push(t);
        });
        return merged;
      });
      setPlayers((prev) => {
        const merged = [...prev];
        importedPlayers.forEach((p) => {
          const idx = merged.findIndex((m) => m.id === p.id);
          if (idx >= 0) merged[idx] = p;
          else merged.push(p);
        });
        return merged;
      });

      const managerTeamId = kind === "save" ? data.manager?.team_id || null : null;
      const label = kind === "save" ? `Save${data.clock?.current_date ? " — " + data.clock.current_date.slice(0, 10) : ""}` : data.name || "Imported world";
      setWorldMeta({ name: label, description: data.description || "", myTeamId: managerTeamId, kind });
      if (managerTeamId) {
        setMyTeamId(managerTeamId);
        setTeamFilter(managerTeamId);
      }
      setImportMsg(
        `Imported ${importedPlayers.length} players, ${importedTeams.length} teams from ${kind === "save" ? "your live save" : `"${data.name || "world"}"`}.`
      );
      setTab("squad");
    } catch (err) {
      setImportMsg(`Import failed — ${err.message || "couldn't parse that file."}`);
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  }

  async function clearDatabase() {
    setPlayers([]);
    setTeams([]);
    setWorldMeta(null);
    setMyTeamId(null);
    setFavorites([]);
    setCompareIds([]);
    setTeamFilter("all");
    setLeagueFilter("all");
    setRoleFilter("All");
    setFavoritesOnly(false);
    setSquadSearch("");
    setConfirmClear(false);
    try {
      await window.storage.set(PLAYERS_KEY, JSON.stringify([]), false);
      await window.storage.set(TEAMS_KEY, JSON.stringify([]), false);
      await window.storage.set(WORLD_KEY, JSON.stringify(null), false);
      await window.storage.set(FAVORITES_KEY, JSON.stringify([]), false);
    } catch (e) {}
    setImportMsg("Cleared all imported data.");
  }

  const comparePlayers = compareIds.map((id) => players.find((p) => p.id === id)).filter(Boolean);

  const leagues = useMemo(() => {
    const set = new Set();
    teams.forEach((t) => { if (t.competition_id) set.add(t.competition_id); });
    return Array.from(set).sort();
  }, [teams]);

  const teamToLeague = useMemo(() => {
    const map = {};
    teams.forEach((t) => (map[t.id] = t.competition_id));
    return map;
  }, [teams]);

  const teamPlayerCounts = useMemo(() => {
    const counts = {};
    players.forEach((p) => {
      if (p.team_id) counts[p.team_id] = (counts[p.team_id] || 0) + 1;
    });
    return counts;
  }, [players]);

  const sortedTeams = useMemo(() => {
    const nonEmpty = teams.filter((t) => (teamPlayerCounts[t.id] || 0) > 0 || t.id === myTeamId);
    const byName = {};
    nonEmpty.forEach((t) => {
      const key = t.name?.trim().toLowerCase();
      (byName[key] = byName[key] || []).push(t);
    });
    const withLabels = nonEmpty.map((t) => {
      const group = byName[t.name?.trim().toLowerCase()];
      let label = t.name;
      if (group.length > 1) {
        const qualifier = t.team_kind || t.competition_id?.toUpperCase() || t.id;
        label = `${t.name} (${qualifier})`;
      }
      return { ...t, label };
    });
    return withLabels.sort((a, b) => a.label.localeCompare(b.label));
  }, [teams, teamPlayerCounts, myTeamId]);

  const teamDropdownOptions = useMemo(() => {
    if (leagueFilter === "all") return sortedTeams;
    return sortedTeams.filter((t) => t.competition_id === leagueFilter);
  }, [sortedTeams, leagueFilter]);

  useEffect(() => {
    if (teamFilter === "all") return;
    if (leagueFilter !== "all" && teamToLeague[teamFilter] !== leagueFilter) {
      setTeamFilter("all");
    }
  }, [leagueFilter]);

  const mySquad = useMemo(() => players.filter((p) => p.team_id === myTeamId), [players, myTeamId]);

  function avgAttrs(list) {
    const out = {};
    ATTRS.forEach((a) => {
      if (list.length === 0) { out[a.key] = 0; return; }
      const sum = list.reduce((s, p) => s + (Number(p.attributes[a.key]) || 0), 0);
      out[a.key] = sum / list.length;
    });
    return out;
  }

  const myTeamAnalysis = useMemo(() => {
    if (!myTeamId || mySquad.length === 0) return null;
    const teamAvg = avgAttrs(mySquad);
    const leagueAvg = avgAttrs(players);
    const rows = ATTRS.map((a) => ({
      key: a.key,
      label: a.label,
      team: teamAvg[a.key],
      league: leagueAvg[a.key],
      delta: teamAvg[a.key] - leagueAvg[a.key],
    }));
    const sortedByDelta = [...rows].sort((a, b) => b.delta - a.delta);
    const strengths = sortedByDelta.slice(0, 3);
    const weaknesses = sortedByDelta.slice(-3).reverse();
    const roleCoverage = POSITIONS.map((role) => {
      const inRole = mySquad.filter((p) => p.position === role).sort((a, b) => overall(b) - overall(a));
      return { role, players: inRole };
    });
    const teamOverall = Math.round(mySquad.reduce((s, p) => s + overall(p), 0) / mySquad.length);
    const radarRows = ATTRS.map((a) => ({ attribute: a.label, team: Math.round(teamAvg[a.key]), league: Math.round(leagueAvg[a.key]) }));
    return { rows, strengths, weaknesses, roleCoverage, teamOverall, radarRows };
  }, [myTeamId, mySquad, players]);

  function scoutForAttribute(attrKey) {
    setSortKey(attrKey);
    setSortDir("desc");
    setTeamFilter("all");
    setRoleFilter("All");
    setSquadSearch("");
    setTab("squad");
  }

  const filteredPlayers = useMemo(() => {
    let list = players;
    if (teamFilter !== "all") list = list.filter((p) => p.team_id === teamFilter);
    if (leagueFilter !== "all") list = list.filter((p) => teamToLeague[p.team_id] === leagueFilter);
    if (roleFilter !== "All") list = list.filter((p) => p.position === roleFilter);
    if (favoritesOnly) list = list.filter((p) => favorites.includes(p.id));
    const q = squadSearch.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.match_name?.toLowerCase().includes(q) ||
          p.full_name?.toLowerCase().includes(q) ||
          p.team_name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [players, teamFilter, leagueFilter, roleFilter, favoritesOnly, favorites, squadSearch, teamToLeague]);

  const sortedPlayers = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    const withVal = filteredPlayers.map((p) => {
      let v;
      switch (sortKey) {
        case "name": v = p.match_name?.toLowerCase() || ""; break;
        case "age": v = age(p.date_of_birth) ?? -1; break;
        case "potential": v = potentialValue(p, revealHidden) ?? -1; break;
        case "market_value": v = Number(p.market_value) || 0; break;
        case "wage": v = Number(p.wage) || 0; break;
        case "team": v = p.team_name?.toLowerCase() || ""; break;
        case "overall": v = overall(p); break;
        default:
          v = ATTRS.some((a) => a.key === sortKey) ? Number(p.attributes[sortKey]) || 0 : overall(p);
      }
      return { p, v };
    });
    withVal.sort((a, b) => {
      if (a.v < b.v) return -1 * dir;
      if (a.v > b.v) return 1 * dir;
      return 0;
    });
    return withVal.map((x) => x.p);
  }, [filteredPlayers, sortKey, sortDir, revealHidden]);

  const pageSize = viewMode === "table" ? 80 : 24;

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [teamFilter, leagueFilter, roleFilter, favoritesOnly, squadSearch, sortKey, sortDir, viewMode]);

  const capped = sortedPlayers.slice(0, visibleCount);

  const compareResults = useMemo(() => {
    const q = compareSearch.trim().toLowerCase();
    if (q) {
      return players
        .filter((p) => p.match_name?.toLowerCase().includes(q) || p.team_name?.toLowerCase().includes(q))
        .slice(0, 30);
    }
    if (favorites.length > 0) {
      const favSet = new Set(favorites);
      return players.filter((p) => favSet.has(p.id));
    }
    return [...players].sort((a, b) => overall(b) - overall(a)).slice(0, 30);
  }, [players, compareSearch, favorites]);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function sortableTh(key) {
    const active = sortKey === key;
    return {
      onClick: () => toggleSort(key),
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleSort(key);
        }
      },
      role: "button",
      tabIndex: 0,
      "aria-sort": active ? (sortDir === "asc" ? "ascending" : "descending") : "none",
    };
  }

  function SortIcon({ active, dir }) {
    if (!active) return null;
    return dir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  }

  return (
    <div data-rr-theme={mode} style={{ fontFamily: "'Inter', sans-serif", background: "var(--bg)", color: "var(--text)", minHeight: "100vh", height: "100%", padding: "28px", borderRadius: "0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        [data-rr-theme="dark"] {
          --bg: #0c0e12;
          --surface: #14171c;
          --surface-alt: #1a1e24;
          --border: #23272e;
          --border-subtle: #1e2228;
          --text: #e7e9ec;
          --text-muted: #8b909a;
          --text-faint: #7d838d;
          --accent: #7c8cff;
          --accent-hover: #98a4ff;
          --on-accent: #0c0e12;
          --danger: #c46a6a;
          --danger-hover: #d68686;
          --danger-bg: #2a1a1a;
          --danger-border: #4a2a2a;
          --danger-text: #e0a8a8;
          --success: #6cb56a;
          --success-hover: #82c680;
          --success-bg: #161d16;
          --success-border: #2a3a2a;
          --success-text: #a8d8ae;
          --success-muted: #3d5c40;
          --pos-top: #e08a5c;
          --pos-jungle: #6cb56a;
          --pos-mid: #9c8cf0;
          --pos-adc: #d97b96;
          --pos-support: #d9b26a;
          --cmp-1: #7c8cff;
          --cmp-2: #6cb56a;
          --cmp-3: #e08a5c;
          --cmp-4: #d97b96;
          --cmp-5: #e0c96a;
        }

        [data-rr-theme="light"] {
          --bg: #f6f7f9;
          --surface: #ffffff;
          --surface-alt: #eef0f3;
          --border: #dde1e6;
          --border-subtle: #e7e9ed;
          --text: #14171c;
          --text-muted: #5b6068;
          --text-faint: #6b7076;
          --accent: #5654d4;
          --accent-hover: #4341b8;
          --on-accent: #ffffff;
          --danger: #c0392b;
          --danger-hover: #a8301f;
          --danger-bg: #fdecea;
          --danger-border: #f3c4bd;
          --danger-text: #a8301f;
          --success: #1a7a2e;
          --success-hover: #268238;
          --success-bg: #eaf7ec;
          --success-border: #c3e6c9;
          --success-text: #1f7a30;
          --success-muted: #7fae86;
          --pos-top: #c15f2e;
          --pos-jungle: #3f9142;
          --pos-mid: #6f5ed6;
          --pos-adc: #bd4c76;
          --pos-support: #a8791f;
          --cmp-1: #5654d4;
          --cmp-2: #2f8f4e;
          --cmp-3: #bf5a2a;
          --cmp-4: #a8446f;
          --cmp-5: #8a7317;
        }

        html, body { background: var(--bg); margin: 0; min-height: 100%; }
        * { box-sizing: border-box; }

        .rr-btn { cursor: pointer; border: none; font-family: 'Inter', sans-serif; font-weight: 500; transition: background 0.14s ease, color 0.14s ease, border-color 0.14s ease, opacity 0.14s ease; }
        .rr-btn:hover:not(:disabled) { opacity: 0.8; }
        .rr-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .rr-btn-primary:hover:not(:disabled) { background: var(--accent-hover) !important; }
        .rr-btn-outline:hover:not(:disabled) { background: var(--surface-alt) !important; border-color: var(--text-faint) !important; }
        .rr-btn-danger:hover:not(:disabled) { background: var(--danger-hover) !important; border-color: var(--danger-hover) !important; color: var(--on-accent) !important; }
        .rr-btn-danger-outline:hover:not(:disabled) { background: var(--danger-bg) !important; border-color: var(--danger) !important; }
        .rr-btn-ghost:hover:not(:disabled) { background: var(--surface-alt) !important; }
        .rr-btn-compare:hover:not(:disabled) { border-color: var(--accent) !important; color: var(--accent) !important; }

        .rr-input, .rr-select { background: var(--surface); border: 1px solid var(--border); color: var(--text); border-radius: 0; padding: 8px 10px; font-family: 'Inter', sans-serif; font-size: 13px; width: 100%; }
        .rr-input:focus, .rr-select:focus { outline: none; border-color: var(--accent); }
        .rr-slider { width: 100%; accent-color: var(--accent); }
        .rr-card { background: var(--surface); border: 1px solid var(--border-subtle); border-radius: 0; padding: 16px; }
        .rr-chip { border: 1px solid var(--border); background: transparent; color: var(--text-muted); padding: 6px 12px; border-radius: 0; font-size: 12.5px; font-weight: 500; cursor: pointer; transition: background 0.14s ease, border-color 0.14s ease, color 0.14s ease; }
        .rr-chip.active { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
        .rr-chip:hover:not(.active) { background: var(--surface-alt); border-color: var(--text-faint); color: var(--text); }
        .rr-icon-btn { background: transparent; border: 1px solid var(--border); color: var(--text-muted); padding: 7px; border-radius: 0; cursor: pointer; display: flex; align-items: center; transition: background 0.14s ease, border-color 0.14s ease, color 0.14s ease; }
        .rr-icon-btn:hover { background: var(--surface-alt); color: var(--text); border-color: var(--text-faint); }
        .rr-icon-btn.active { color: var(--text); border-color: var(--text-faint); background: var(--surface-alt); }
        .rr-th { text-align: left; padding: 9px 10px; color: var(--text-faint); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; cursor: pointer; white-space: nowrap; user-select: none; }
        .rr-th:hover { color: var(--text-muted); }
        .rr-td { padding: 10px; border-top: 1px solid var(--surface-alt); font-size: 13.5px; vertical-align: middle; }
        .rr-row:hover { background: var(--surface-alt); }
        .rr-star { cursor: pointer; }

        button:focus-visible, input:focus-visible, select:focus-visible, a:focus-visible, [role="button"]:focus-visible, th:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .rr-btn, .rr-star, .rr-chip, .rr-icon-btn { transition: none !important; }
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <OMLLogo mode={mode} height={42} />
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "3px 0 0" }}>Scouting and squad comparison for OML</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", gap: "4px", background: "var(--surface)", border: "1px solid var(--border-subtle)", borderRadius: "0", padding: "3px" }}>
            {[
              { id: "squad", label: "Squad", icon: Users },
              { id: "myteam", label: "My Team", icon: Shield },
              { id: "compare", label: "Compare", icon: GitCompare },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className="rr-btn"
                onClick={() => setTab(id)}
                style={{
                  display: tab === "add" && id !== tab ? "none" : "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "0",
                  fontSize: "13px",
                  background: tab === id ? "var(--border-subtle)" : "transparent",
                  color: tab === id ? "var(--text)" : "var(--text-muted)",
                }}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", background: "var(--surface)", border: "1px solid var(--border-subtle)", borderRadius: "0", padding: "3px" }}>
            <button
              className="rr-icon-btn"
              onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
              aria-label="Toggle color theme"
              title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              style={{ border: "none", padding: "7px" }}
            >
              {mode === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </div>

      {worldMeta && tab !== "add" && (
        <p style={{ fontSize: "12px", color: "var(--text-faint)", margin: "0 0 16px" }}>
          {worldMeta.name} &middot; {teams.length} teams &middot; {players.length} players
          {myTeamId && teams.find((t) => t.id === myTeamId) && (
            <> &middot; your club: <span style={{ color: ACCENT }}>{teams.find((t) => t.id === myTeamId)?.name}</span></>
          )}
        </p>
      )}

      {saveError && (
        <div role="alert" style={{ background: "var(--danger-bg)", border: "1px solid var(--danger-border)", color: "var(--danger-text)", fontSize: "12px", padding: "8px 12px", borderRadius: "0", marginBottom: "14px" }}>
          Couldn't save changes — your latest edits may not persist.
        </div>
      )}
      {importMsg && (
        <div role="status" aria-live="polite" style={{ background: "var(--success-bg)", border: "1px solid var(--success-border)", color: "var(--success-text)", fontSize: "12px", padding: "8px 12px", borderRadius: "0", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{importMsg}</span>
          <button className="rr-btn" onClick={() => setImportMsg(null)} style={{ background: "transparent", color: "var(--success-text)" }}><X size={14} /></button>
        </div>
      )}

      {tab === "squad" && (
        <div>
          {/* Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ position: "relative", flex: "1 1 220px", minWidth: "200px" }}>
              <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
              <input className="rr-input" style={{ paddingLeft: "30px" }} aria-label="Search player or team" placeholder="Search player or team" value={squadSearch} onChange={(e) => setSquadSearch(e.target.value)} />
            </div>
            <select className="rr-select" aria-label="Filter by team" style={{ width: "auto", minWidth: "170px" }} value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}>
              <option value="all">All teams</option>
              {myTeamId && teams.find((t) => t.id === myTeamId) && <option value={myTeamId}>★ {teams.find((t) => t.id === myTeamId)?.name}</option>}
              {teamDropdownOptions.filter((t) => t.id !== myTeamId).map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
            <select className="rr-select" aria-label="Filter by league" style={{ width: "auto", minWidth: "140px" }} value={leagueFilter} onChange={(e) => setLeagueFilter(e.target.value)}>
              <option value="all">All leagues</option>
              {leagues.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
            <select className="rr-select" aria-label="Sort players by" style={{ width: "auto", minWidth: "150px" }} value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
              {SORT_OPTIONS.map((o) => <option key={o.key} value={o.key}>Sort: {o.label}</option>)}
            </select>
            <button className="rr-icon-btn" onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))} aria-label="Toggle sort direction">
              {sortDir === "asc" ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            <div style={{ display: "flex", gap: "2px" }}>
              <button className={`rr-icon-btn ${viewMode === "table" ? "active" : ""}`} onClick={() => setViewMode("table")} aria-label="Table view"><Rows3 size={15} /></button>
              <button className={`rr-icon-btn ${viewMode === "cards" ? "active" : ""}`} onClick={() => setViewMode("cards")} aria-label="Card view"><LayoutGrid size={15} /></button>
            </div>
            <div style={{ flex: 1 }} />
            {players.length > 0 && !confirmClear && (
              <button className="rr-btn rr-btn-danger-outline" onClick={() => setConfirmClear(true)} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--danger)", padding: "8px 14px", borderRadius: "0", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Trash2 size={14} /> Clear database
              </button>
            )}
            {confirmClear && (
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "var(--danger)", border: "1px solid var(--danger-border)", padding: "6px 10px" }}>
                Delete all {players.length} players and {teams.length} teams?
                <button className="rr-btn rr-btn-danger" onClick={clearDatabase} style={{ background: "var(--danger)", color: "var(--on-accent)", padding: "5px 10px", borderRadius: "0", fontSize: "12px" }}>Yes, clear</button>
                <button className="rr-btn rr-btn-outline" onClick={() => setConfirmClear(false)} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)", padding: "5px 10px", borderRadius: "0", fontSize: "12px" }}>Cancel</button>
              </span>
            )}
            <input type="file" accept=".json,.olsave" ref={fileInputRef} onChange={handleFileUpload} style={{ display: "none" }} />
            <SaveLocationHelp />
            <button className="rr-btn rr-btn-outline" onClick={() => fileInputRef.current.click()} disabled={importing} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)", padding: "8px 14px", borderRadius: "0", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Upload size={14} /> {importing ? "Importing…" : "Import"}
            </button>
            <button className="rr-btn rr-btn-primary" onClick={startAdd} style={{ background: ACCENT, color: "var(--on-accent)", padding: "8px 14px", borderRadius: "0", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Plus size={14} /> Add player
            </button>
          </div>

          {/* Role filter + favorites + reveal toggle */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginBottom: "16px" }}>
            {["All", ...POSITIONS].map((r) => (
              <button key={r} className={`rr-chip ${roleFilter === r ? "active" : ""}`} onClick={() => setRoleFilter(r)}>
                {r}
              </button>
            ))}
            <button className={`rr-chip ${favoritesOnly ? "active" : ""}`} onClick={() => setFavoritesOnly((v) => !v)} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Star size={12} fill={favoritesOnly ? ACCENT : "none"} /> Shortlist ({favorites.length})
            </button>
            <div style={{ flex: 1 }} />
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-faint)", cursor: "pointer" }}>
              <input type="checkbox" checked={revealHidden} onChange={(e) => setRevealHidden(e.target.checked)} />
              {revealHidden ? <Eye size={13} /> : <EyeOff size={13} />} Show unscouted potential (spoils it — off by default)
            </label>
          </div>

          {players.length === 0 ? (
            <div className="rr-card" style={{ textAlign: "center", padding: "56px 24px" }}>
              <p style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 6px" }}>Your scouting database is empty</p>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "0 0 20px" }}>Import your .olsave or a world.json export, or add a player manually.</p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button className="rr-btn rr-btn-outline" onClick={() => fileInputRef.current.click()} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)", padding: "9px 18px", borderRadius: "0", fontSize: "13px" }}>Import save file</button>
                <button className="rr-btn rr-btn-primary" onClick={startAdd} style={{ background: ACCENT, color: "var(--on-accent)", padding: "9px 18px", borderRadius: "0", fontSize: "13px" }}>Add player</button>
              </div>
              <p style={{ fontSize: "11px", color: "var(--text-faint)", marginTop: "14px" }}>
                Not sure where your save is? Click the <HelpCircle size={11} style={{ verticalAlign: "-1px" }} /> icon next to Import above, or on Windows check <code style={{ background: "var(--surface-alt)", padding: "1px 4px" }}>%APPDATA%\com.openleaguemanager.olmanager\saves</code>.
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: "12px", color: "var(--text-faint)", marginBottom: "10px" }}>
                {sortedPlayers.length > capped.length
                  ? `Showing 1–${capped.length} of ${sortedPlayers.length} players`
                  : `${sortedPlayers.length} player${sortedPlayers.length !== 1 ? "s" : ""}`}
              </p>

              {viewMode === "table" ? (
                <div className="rr-card" style={{ padding: 0, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th className="rr-th" style={{ width: "30px" }}></th>
                        <th className="rr-th" {...sortableTh("name")}>Name <SortIcon active={sortKey === "name"} dir={sortDir} /></th>
                        <th className="rr-th">Role</th>
                        <th className="rr-th" {...sortableTh("team")}>Team <SortIcon active={sortKey === "team"} dir={sortDir} /></th>
                        <th className="rr-th" {...sortableTh("age")}>Age <SortIcon active={sortKey === "age"} dir={sortDir} /></th>
                        <th className="rr-th" {...sortableTh("overall")} title="Overall rating">Ovr <SortIcon active={sortKey === "overall"} dir={sortDir} /></th>
                        <th className="rr-th" {...sortableTh("potential")} title="Potential (once scouted)">Pot <SortIcon active={sortKey === "potential"} dir={sortDir} /></th>
                        <th className="rr-th" {...sortableTh("market_value")} title="Market value">Value <SortIcon active={sortKey === "market_value"} dir={sortDir} /></th>
                        <th className="rr-th">Profile</th>
                        <th className="rr-th" style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {capped.map((p) => {
                        const pot = potentialValue(p, revealHidden);
                        const isFav = favorites.includes(p.id);
                        const inCompare = compareIds.includes(p.id);
                        return (
                          <tr key={p.id} className="rr-row">
                            <td className="rr-td">
                              <button
                                className="rr-btn rr-star-btn"
                                onClick={() => toggleFavorite(p.id)}
                                aria-pressed={isFav}
                                aria-label={isFav ? `Remove ${p.match_name} from shortlist` : `Add ${p.match_name} to shortlist`}
                                style={{ background: "transparent", padding: "4px", display: "flex" }}
                              >
                                <Star size={14} className="rr-star" fill={isFav ? ACCENT : "none"} color={isFav ? ACCENT : "var(--text-faint)"} />
                              </button>
                            </td>
                            <td className="rr-td">
                              <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                                <FlagImg code={p.nationality} size={13} /> {p.match_name}
                              </div>
                              {p.full_name && <div style={{ fontSize: "11px", color: "var(--text-faint)" }}>{p.full_name}</div>}
                            </td>
                            <td className="rr-td">
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ width: "7px", height: "7px", borderRadius: "0", background: POS_COLOR[p.position] || "var(--text-faint)", display: "inline-block" }} />
                                {p.position}
                              </span>
                            </td>
                            <td className="rr-td" style={{ color: "var(--text-muted)" }}>{p.team_name || "Free agent"}</td>
                            <td className="rr-td" style={{ color: "var(--text-muted)" }}>{age(p.date_of_birth) ?? "—"}</td>
                            <td className="rr-td" style={{ fontWeight: 700, color: ACCENT }}>{overall(p)}</td>
                            <td className="rr-td" style={{ color: pot !== null ? "var(--success)" : "var(--text-faint)" }}>{pot !== null ? pot : "—"}</td>
                            <td className="rr-td" style={{ color: "var(--text-muted)" }}>{p.market_value ? Number(p.market_value).toLocaleString() : "—"}</td>
                            <td className="rr-td">
                              <MiniBars attrs={p.attributes} />
                            </td>
                            <td className="rr-td" style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                              <button className="rr-btn rr-btn-compare" onClick={() => toggleCompare(p.id)} title="Add to comparison" style={{ background: inCompare ? ACCENT + "22" : "transparent", color: inCompare ? ACCENT : "var(--text-muted)", border: `1px solid ${inCompare ? ACCENT : "var(--border)"}`, borderRadius: "0", padding: "5px 8px", fontSize: "11px", marginRight: "4px" }}>
                                {inCompare ? "Added" : "Compare"}
                              </button>
                              <button className="rr-btn" onClick={() => startEdit(p)} style={{ background: "transparent", color: "var(--text-muted)", padding: "5px", borderRadius: "0" }} aria-label={`Edit ${p.match_name}`}><Pencil size={13} /></button>
                              <button className="rr-btn" onClick={() => deletePlayer(p.id)} style={{ background: "transparent", color: "var(--danger)", padding: "5px", borderRadius: "0" }} aria-label={`Delete ${p.match_name}`}><Trash2 size={13} /></button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "14px" }}>
                  {capped.map((p) => {
                    const pot = potentialValue(p, revealHidden);
                    const isFav = favorites.includes(p.id);
                    return (
                      <div key={p.id} className="rr-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div>
                              <p style={{ fontWeight: 600, fontSize: "15px", margin: 0 }}>{p.match_name}</p>
                              <p style={{ fontSize: "11px", color: "var(--text-faint)", margin: "1px 0 0" }}>{p.position} &middot; {p.team_name || "Free agent"}</p>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "4px" }}>
                            <button
                              className="rr-btn rr-star-btn"
                              onClick={() => toggleFavorite(p.id)}
                              aria-pressed={isFav}
                              aria-label={isFav ? `Remove ${p.match_name} from shortlist` : `Add ${p.match_name} to shortlist`}
                              style={{ background: "transparent", padding: "2px", display: "flex" }}
                            >
                              <Star size={15} className="rr-star" fill={isFav ? ACCENT : "none"} color={isFav ? ACCENT : "var(--text-faint)"} />
                            </button>
                            <button className="rr-btn" onClick={() => startEdit(p)} aria-label={`Edit ${p.match_name}`} style={{ background: "transparent", color: "var(--text-muted)", padding: "2px" }}><Pencil size={13} /></button>
                            <button className="rr-btn" onClick={() => deletePlayer(p.id)} aria-label={`Delete ${p.match_name}`} style={{ background: "transparent", color: "var(--danger)", padding: "2px" }}><Trash2 size={13} /></button>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "16px", fontSize: "11px", color: "var(--text-faint)", marginBottom: "8px" }}>
                          <span>Age <b style={{ color: "var(--text)", display: "block", fontSize: "13px" }}>{age(p.date_of_birth) ?? "—"}</b></span>
                          <span>Overall <b style={{ color: ACCENT, display: "block", fontSize: "13px" }}>{overall(p)}</b></span>
                          <span>Potential <b style={{ color: pot !== null ? "var(--success)" : "var(--text-faint)", display: "block", fontSize: "13px" }}>{pot !== null ? pot : "Hidden"}</b></span>
                        </div>
                        <div style={{ height: "200px" }} aria-hidden="true">
                          <ResponsiveContainer width="100%" height={200}>
                            <RadarChart data={radarData(p)} outerRadius={72} cx="50%" cy="50%">
                              <PolarGrid stroke="var(--border-subtle)" />
                              <PolarAngleAxis dataKey="attribute" tick={{ fill: "var(--text-faint)", fontSize: 8 }} />
                              <PolarRadiusAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                              <Radar dataKey="value" stroke={ACCENT} fill={ACCENT} fillOpacity={0.18} strokeWidth={2} isAnimationActive={false} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                        <button className="rr-btn rr-btn-compare" onClick={() => toggleCompare(p.id)} style={{ width: "100%", marginTop: "6px", background: compareIds.includes(p.id) ? ACCENT + "1f" : "transparent", border: `1px solid ${compareIds.includes(p.id) ? ACCENT : "var(--border)"}`, color: compareIds.includes(p.id) ? ACCENT : "var(--text)", padding: "7px", borderRadius: "0", fontSize: "12.5px" }}>
                          {compareIds.includes(p.id) ? "Added to comparison" : "Add to comparison"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {sortedPlayers.length > capped.length && (
                <div style={{ textAlign: "center", marginTop: "14px" }}>
                  <button className="rr-btn rr-btn-outline" onClick={() => setVisibleCount((v) => v + pageSize)} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)", padding: "9px 20px", borderRadius: "0", fontSize: "13px" }}>
                    Show {Math.min(pageSize, sortedPlayers.length - capped.length)} more ({sortedPlayers.length - capped.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === "myteam" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label htmlFor="f-my-team" style={{ fontSize: "12px", color: "var(--text-faint)" }}>Managing</label>
              <select
                id="f-my-team"
                className="rr-select"
                style={{ width: "auto", minWidth: "220px" }}
                value={myTeamId || ""}
                onChange={(e) => {
                  const id = e.target.value || null;
                  setMyTeamId(id);
                  setWorldMeta((prev) => (prev ? { ...prev, myTeamId: id } : { name: "Manual selection", myTeamId: id }));
                }}
              >
                <option value="">Select your team…</option>
                {sortedTeams.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            {myTeamAnalysis && (
              <div style={{ fontSize: "12px", color: "var(--text-faint)" }}>
                Squad average overall <span style={{ color: ACCENT, fontWeight: 700, fontSize: "16px" }}>{myTeamAnalysis.teamOverall}</span>
              </div>
            )}
          </div>

          {!myTeamId ? (
            <div className="rr-card" style={{ textAlign: "center", padding: "48px 24px" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>Select your team above to see it. Import an .olsave and we'll detect your club automatically.</p>
            </div>
          ) : !myTeamAnalysis ? (
            <div className="rr-card" style={{ textAlign: "center", padding: "48px 24px" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>No players loaded for this team yet.</p>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div className="rr-card">
                  <p style={{ fontSize: "12px", color: "var(--text-faint)", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Role coverage</p>
                  {myTeamAnalysis.roleCoverage.map(({ role, players: rolePlayers }) => (
                    <div key={role} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--surface-alt)" }}>
                      <span style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ width: "7px", height: "7px", background: POS_COLOR[role] }} /> {role}
                      </span>
                      {rolePlayers.length === 0 ? (
                        <span style={{ fontSize: "12.5px", color: "var(--danger)" }}>No player in this role</span>
                      ) : (
                        <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                          {rolePlayers[0].match_name} <b style={{ color: ACCENT }}>{overall(rolePlayers[0])}</b>
                          {rolePlayers.length > 1 && <> &middot; +{rolePlayers.length - 1} backup</>}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="rr-card">
                  <p style={{ fontSize: "12px", color: "var(--text-faint)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Squad vs. league average</p>
                  <div style={{ height: "230px" }} aria-hidden="true">
                    <ResponsiveContainer width="100%" height={230}>
                      <RadarChart data={myTeamAnalysis.radarRows} outerRadius={82} cx="50%" cy="50%">
                        <PolarGrid stroke="var(--border-subtle)" />
                        <PolarAngleAxis dataKey="attribute" tick={{ fill: "var(--text-faint)", fontSize: 8 }} />
                        <PolarRadiusAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Your squad" dataKey="team" stroke={ACCENT} fill={ACCENT} fillOpacity={0.16} strokeWidth={2} isAnimationActive={false} />
                        <Radar name="League avg." dataKey="league" stroke="var(--text-faint)" fill="var(--text-faint)" fillOpacity={0.05} strokeWidth={1.5} strokeDasharray="4 3" isAnimationActive={false} />
                        <Legend wrapperStyle={{ fontSize: "11px", color: "var(--text-muted)" }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div className="rr-card">
                  <p style={{ fontSize: "12px", color: "var(--text-faint)", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Strengths</p>
                  {myTeamAnalysis.strengths.map((r) => (
                    <div key={r.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--surface-alt)" }}>
                      <span style={{ fontSize: "13px" }}>{r.label}</span>
                      <span style={{ fontSize: "12.5px", color: "var(--success)" }}>{r.team.toFixed(1)} <span style={{ color: "var(--success-muted)" }}>({r.delta >= 0 ? "+" : ""}{r.delta.toFixed(1)} vs league)</span></span>
                    </div>
                  ))}
                </div>

                <div className="rr-card">
                  <p style={{ fontSize: "12px", color: "var(--text-faint)", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Weaknesses — scout to fix these</p>
                  {myTeamAnalysis.weaknesses.map((r) => (
                    <div key={r.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--surface-alt)" }}>
                      <div>
                        <div style={{ fontSize: "13px" }}>{r.label}</div>
                        <div style={{ fontSize: "11.5px", color: "var(--danger)" }}>{r.team.toFixed(1)} ({r.delta >= 0 ? "+" : ""}{r.delta.toFixed(1)} vs league)</div>
                      </div>
                      <button className="rr-btn" onClick={() => scoutForAttribute(r.key)} style={{ background: "transparent", border: `1px solid ${ACCENT}`, color: ACCENT, padding: "5px 10px", borderRadius: "0", fontSize: "11.5px" }}>
                        Find players →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "add" && (
        <form onSubmit={submitForm} className="rr-card" style={{ maxWidth: "640px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <button type="button" className="rr-btn" onClick={() => { setTab("squad"); setEditingId(null); }} style={{ background: "transparent", color: "var(--text-muted)", padding: "4px" }} aria-label="Back"><ChevronLeft size={18} /></button>
            <p style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>{editingId ? "Edit player" : "Add player"}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div>
              <label htmlFor="f-match-name" style={{ fontSize: "11px", color: "var(--text-faint)" }}>Match name (IGN)</label>
              <input id="f-match-name" className="rr-input" value={form.match_name} onChange={(e) => setForm({ ...form, match_name: e.target.value })} placeholder="Empyros" required />
            </div>
            <div>
              <label htmlFor="f-full-name" style={{ fontSize: "11px", color: "var(--text-faint)" }}>Full name</label>
              <input id="f-full-name" className="rr-input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Panagiotis Tantis" />
            </div>
            <div>
              <label htmlFor="f-role" style={{ fontSize: "11px", color: "var(--text-faint)" }}>Role</label>
              <select id="f-role" className="rr-select" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>
                {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="f-nationality" style={{ fontSize: "11px", color: "var(--text-faint)" }}>Nationality (ISO code)</label>
              <input id="f-nationality" className="rr-input" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value.toUpperCase() })} placeholder="GR" maxLength={3} />
            </div>
            <div>
              <label htmlFor="f-dob" style={{ fontSize: "11px", color: "var(--text-faint)" }}>Date of birth</label>
              <input id="f-dob" className="rr-input" type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
            </div>
            <div>
              <label htmlFor="f-team" style={{ fontSize: "11px", color: "var(--text-faint)" }}>Team</label>
              <select id="f-team" className="rr-select" value={form.team_id} onChange={(e) => setForm({ ...form, team_id: e.target.value })}>
                <option value="">Free agent / custom</option>
                {sortedTeams.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="f-wage" style={{ fontSize: "11px", color: "var(--text-faint)" }}>Wage</label>
              <input id="f-wage" className="rr-input" type="number" min="0" value={form.wage} onChange={(e) => setForm({ ...form, wage: e.target.value })} />
            </div>
            <div>
              <label htmlFor="f-market-value" style={{ fontSize: "11px", color: "var(--text-faint)" }}>Market value</label>
              <input id="f-market-value" className="rr-input" type="number" min="0" value={form.market_value} onChange={(e) => setForm({ ...form, market_value: e.target.value })} />
            </div>
            <div>
              <label htmlFor="f-potential-revealed" style={{ fontSize: "11px", color: "var(--text-faint)" }}>Scouted potential (if known)</label>
              <input id="f-potential-revealed" className="rr-input" type="number" min="0" max="110" value={form.potential_revealed} onChange={(e) => setForm({ ...form, potential_revealed: e.target.value })} placeholder="blank if unknown" />
            </div>
            <div>
              <label htmlFor="f-potential-base" style={{ fontSize: "11px", color: "var(--text-faint)" }}>Your own estimate (optional)</label>
              <input id="f-potential-base" className="rr-input" type="number" min="0" max="110" value={form.potential_base} onChange={(e) => setForm({ ...form, potential_base: e.target.value })} placeholder="private guess" />
            </div>
          </div>

          <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 10px", color: ACCENT }}>Attributes</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
            {ATTRS.map((a) => (
              <div key={a.key}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-faint)", marginBottom: "2px" }}>
                  <span>{a.label}</span>
                  <span style={{ color: "var(--text)", fontWeight: 600 }}>{form.attributes[a.key]}</span>
                </div>
                <input className="rr-slider" type="range" min="0" max="100" step="1" value={form.attributes[a.key]} onChange={(e) => setForm({ ...form, attributes: { ...form.attributes, [a.key]: Number(e.target.value) } })} />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="rr-btn rr-btn-primary" style={{ background: ACCENT, color: "var(--on-accent)", padding: "9px 18px", borderRadius: "0", fontSize: "13px" }}>{editingId ? "Save changes" : "Add to squad"}</button>
            <button type="button" className="rr-btn rr-btn-outline" onClick={() => { setTab("squad"); setEditingId(null); }} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)", padding: "9px 18px", borderRadius: "0", fontSize: "13px" }}>Cancel</button>
          </div>
        </form>
      )}

      {tab === "compare" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>Pick up to {MAX_COMPARE} players to compare — from your squad or anywhere else.</p>
            {favorites.length > 0 && (
              <button
                className="rr-btn"
                onClick={() => setCompareIds(favorites.slice(0, MAX_COMPARE))}
                style={{ background: "transparent", border: `1px solid ${ACCENT}`, color: ACCENT, padding: "6px 12px", borderRadius: "0", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Star size={12} fill={ACCENT} /> Load shortlist ({Math.min(favorites.length, MAX_COMPARE)})
              </button>
            )}
          </div>
          <div style={{ position: "relative", marginBottom: "12px" }}>
            <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
            <input className="rr-input" style={{ paddingLeft: "30px" }} aria-label="Search player or team for comparison" placeholder="Search player or team" value={compareSearch} onChange={(e) => setCompareSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
            {compareResults.map((p) => {
              const idx = compareIds.indexOf(p.id);
              const selected = idx !== -1;
              return (
                <button key={p.id} className="rr-btn" onClick={() => toggleCompare(p.id)} style={{ padding: "6px 12px", borderRadius: "0", fontSize: "12.5px", border: selected ? `1px solid ${COMPARE_COLORS[idx]}` : "1px solid var(--border)", background: selected ? COMPARE_COLORS[idx] + "1f" : "transparent", color: selected ? COMPARE_COLORS[idx] : "var(--text)", display: "flex", alignItems: "center", gap: "6px" }}>
                  {p.match_name} <span style={{ opacity: 0.6, fontSize: "11px" }}>({p.position}{p.team_name ? `, ${p.team_name}` : ""})</span> {selected && <X size={11} />}
                </button>
              );
            })}
            {players.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Import a save/world.json or add players first.</p>}
            {players.length > 0 && compareResults.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No matches — try a different search term.</p>}
          </div>
          {players.length > 0 && !compareSearch && (
            <p style={{ fontSize: "11px", color: "var(--text-faint)", marginTop: "-14px", marginBottom: "16px" }}>
              {favorites.length > 0 ? "Showing your shortlist — search to add anyone else" : "Sorted by overall — search to find someone specific"}.
            </p>
          )}

          {comparePlayers.length === 0 ? (
            <div className="rr-card" style={{ textAlign: "center", padding: "40px 24px" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>Pick players above to compare them.</p>
            </div>
          ) : (
            <div className="rr-card">
              <div style={{ height: "380px" }} aria-hidden="true">
                <ResponsiveContainer width="100%" height={380}>
                  <RadarChart data={compareData(comparePlayers)} outerRadius={140} cx="50%" cy="50%">
                    <PolarGrid stroke="var(--border-subtle)" />
                    <PolarAngleAxis dataKey="attribute" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                    <PolarRadiusAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                    {comparePlayers.map((p, i) => (
                      <Radar key={p.id} name={p.match_name} dataKey={`p${i}`} stroke={COMPARE_COLORS[i]} fill={COMPARE_COLORS[i]} fillOpacity={0.1} strokeWidth={2} isAnimationActive={false} />
                    ))}
                    <Legend wrapperStyle={{ fontSize: "12px", color: "var(--text)" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px", fontSize: "13px" }}>
                <thead>
                  <tr>
                    <th className="rr-th" style={{ cursor: "default" }}>Attribute</th>
                    {comparePlayers.map((p, i) => <th key={p.id} className="rr-th" style={{ textAlign: "center", color: COMPARE_COLORS[i], cursor: "default" }}>{p.match_name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {ATTRS.map((a) => {
                    const vals = comparePlayers.map((p) => Number(p.attributes[a.key]) || 0);
                    const max = Math.max(...vals);
                    return (
                      <tr key={a.key}>
                        <td className="rr-td" style={{ color: "var(--text-muted)" }}>{a.label}</td>
                        {comparePlayers.map((p, i) => (
                          <td key={p.id} className="rr-td" style={{ textAlign: "center", fontWeight: vals[i] === max ? 700 : 400, color: vals[i] === max ? ACCENT : "var(--text)" }}>{vals[i]}</td>
                        ))}
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="rr-td" style={{ color: "var(--text-muted)", fontWeight: 600 }}>Overall</td>
                    {comparePlayers.map((p, i) => <td key={p.id} className="rr-td" style={{ textAlign: "center", fontWeight: 700, color: COMPARE_COLORS[i] }}>{overall(p)}</td>)}
                  </tr>
                  <tr>
                    <td className="rr-td" style={{ color: "var(--text-muted)", fontWeight: 600 }}>Potential</td>
                    {comparePlayers.map((p, i) => {
                      const pot = potentialValue(p, revealHidden);
                      return <td key={p.id} className="rr-td" style={{ textAlign: "center", fontWeight: 700, color: pot !== null ? "var(--success)" : "var(--text-faint)" }}>{pot !== null ? pot : "—"}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MiniBars({ attrs }) {
  return (
    <div aria-hidden="true" style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "22px" }}>
      {ATTRS.map((a) => {
        const v = Number(attrs[a.key]) || 0;
        return (
          <div
            key={a.key}
            title={`${a.label}: ${v}`}
            style={{ width: "4px", height: `${Math.max(3, (v / 100) * 22)}px`, background: ACCENT, opacity: 0.35 + (v / 100) * 0.65, borderRadius: "0" }}
          />
        );
      })}
    </div>
  );
}
