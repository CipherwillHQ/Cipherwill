/**
 * What it does: Defines TypeScript interfaces for Press outlets and media coverage.
 * What it owns: PressOutlet interface definition.
 * What it does NOT do: Does not define components or actual static arrays of press data.
 */

export interface PressOutlet {
  name: string;
  logo: string;
  url: string;
}
