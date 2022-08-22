const colors: string[] = [
  '#2b6bdd',
  '#4966da',
  '#5f62d5',
  '#705cd0',
  '#7e57cb',
  '#8b51c4',
  '#964bbd',
  '#a044b6',
  '#a93dae',
  '#b136a5',
];

export class Color {

  static randomHex(): string {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  }

  static getColorByIndex(index: number, alpha: string): string {
    return (colors[index] ?? this.randomHex()) + alpha;
  }

}
