const colors: string[] = [
  '#6d1b7b',
  '#1769aa',
  '#ff9800',
  '#009688',
  '#30c9dc',
  '#e91e63',
  '#852196',
  '#ff9800',
  '#c61a54',
];

export class Color {

  static randomHex(): string {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  }

  static getColorByIndex(index: number, alpha: string): string {
    return (colors[index] ?? this.randomHex()) + alpha;
  }

}
