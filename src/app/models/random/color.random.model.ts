const colors: string[] = [
  '#ff0000',
  '#ffdd00',
  '#4baaf5',
  '#fbc02d',
  '#30c9dc',
  '#689f38',
  '#ed4981',
  '#4e5fbb',
  '#00534b'
];

export class Color {

  static randomHex(): string {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  }

  static getColorByIndex(index: number): string {
    return colors[index] ?? this.randomHex();
  }

}
