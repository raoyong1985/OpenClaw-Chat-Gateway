import { 
  File as FileIcon, 
  FileText, 
  FileArchive, 
  FileCode, 
  Music, 
  Video, 
  FileSpreadsheet, 
  FileBarChart, 
  FileImage 
} from 'lucide-react';

const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico', 'avif'];
const AUDIO_EXTS = ['mp3', 'flac', 'wav', 'ogg', 'm4a', 'aac', 'wma', 'opus'];
const VIDEO_EXTS = ['mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv', 'm4v'];
const CODE_EXTS = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'h', 'go', 'rs', 'rb', 'php', 'html', 'css', 'scss', 'less', 'sql', 'sh', 'bash', 'zsh'];
const DOC_EXTS = ['pdf', 'doc', 'docx', 'rtf'];
const SHEET_EXTS = ['xls', 'xlsx', 'csv'];
const SLIDE_EXTS = ['ppt', 'pptx'];
const ARCHIVE_EXTS = ['zip', 'rar', '7z', 'tar', 'gz'];

export function getExt(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isImageFile(filename: string): boolean {
  return IMAGE_EXTS.includes(getExt(filename));
}

export function isAudioFile(filename: string): boolean {
  return AUDIO_EXTS.includes(getExt(filename));
}

export function isVideoFile(filename: string): boolean {
  return VIDEO_EXTS.includes(getExt(filename));
}

export function isMediaFile(filename: string): boolean {
  return isImageFile(filename) || isAudioFile(filename) || isVideoFile(filename);
}

/** Get the MIME type string for a given filename */
export function getMimeType(filename: string): string {
  const ext = getExt(filename);
  const mimeMap: Record<string, string> = {
    // images
    png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
    svg: 'image/svg+xml', webp: 'image/webp', bmp: 'image/bmp', avif: 'image/avif',
    // audio
    mp3: 'audio/mpeg', flac: 'audio/flac', wav: 'audio/wav', ogg: 'audio/ogg',
    m4a: 'audio/mp4', aac: 'audio/aac', opus: 'audio/opus',
    // video
    mp4: 'video/mp4', webm: 'video/webm', mkv: 'video/x-matroska',
    mov: 'video/quicktime', avi: 'video/x-msvideo', flv: 'video/x-flv',
  };
  return mimeMap[ext] || 'application/octet-stream';
}

export function getFileIconInfo(filename: string) {
  const ext = getExt(filename);
  let Icon = FileIcon;
  let typeText = '文件';
  let bgColor = 'bg-blue-500';

  if ([...DOC_EXTS, 'txt'].includes(ext)) {
    Icon = FileText;
    typeText = (ext === 'pdf' ? 'PDF' : '文档');
    bgColor = 'bg-rose-500';
  } else if (ARCHIVE_EXTS.includes(ext)) {
    Icon = FileArchive;
    typeText = '压缩包';
    bgColor = 'bg-amber-500';
  } else if (CODE_EXTS.includes(ext)) {
    Icon = FileCode;
    typeText = '代码';
    bgColor = 'bg-slate-700';
  } else if (AUDIO_EXTS.includes(ext)) {
    Icon = Music;
    typeText = '音频';
    bgColor = 'bg-purple-500';
  } else if (VIDEO_EXTS.includes(ext)) {
    Icon = Video;
    typeText = '视频';
    bgColor = 'bg-indigo-500';
  } else if (SHEET_EXTS.includes(ext)) {
    Icon = FileSpreadsheet;
    typeText = '表格';
    bgColor = 'bg-emerald-500';
  } else if (SLIDE_EXTS.includes(ext)) {
    Icon = FileBarChart;
    typeText = '演示文稿';
    bgColor = 'bg-orange-500';
  } else if (IMAGE_EXTS.includes(ext)) {
    Icon = FileImage;
    typeText = '图片';
    bgColor = 'bg-sky-500';
  }
  
  return { Icon, typeText, bgColor };
}
