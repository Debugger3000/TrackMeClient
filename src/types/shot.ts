// values to use
export const CLUBTYPE = {
  Driver: "Dr",
  ThreeWood: "3w",
  FourWood: "4w",
  FiveWood: "5w",
  OneIron: "1i",
  TwoIron: "2i",
  ThreeIron: "3i",
  FourIron: "4i",
  FiveIron: "5i",
  SixIron: "6i",
  SevenIron: "7i",
  EightIron: "8i",
  NineIron: "9i",
  PitchingWedge: "PW",
  FiftyFour: "54",
  FiftySix: "56",
  FiftyEight: "58",
  Sixty: "60",
};

export const SHOTPATH = {
  Straight: "straight",
  Draw: "draw",
  Push: "push",
  Slice: "slice",
  PushSlice: "pushSlice",
  Fade: "fade",
  Pull: "pull",
  Hook: "hook",
  PullHook: "pullHook",
};

export const SHOTCONTACT = {
  Fat: "fat",
  Thin: "thin",
  Toe: "toe",
  Heel: "heel",
};

export interface IShot {
  clubType:
    | "Dr"
    | "3w"
    | "4w"
    | "5w"
    | "1i"
    | "2i"
    | "3i"
    | "4i"
    | "5i"
    | "6i"
    | "7i"
    | "8i"
    | "9i"
    | "PW"
    | "54"
    | "56"
    | "58"
    | "60";
  shotContact: "fat" | "thin";
  shotPath: IShotPaths;
}

export type IShotPaths =
  | "straight"
  | "draw"
  | "push"
  | "slice"
  | "pushSlice"
  | "fade"
  | "pull"
  | "hook"
  | "pullHook";

export const SHOTPATHSVG = {
  straight: {
    d: "M100,380 C100,300 100,200 100,75",
    class: "straight",
  },
  fade: {
    d: "M100,380 C120,50 150,10 100,145",
    class: "fade",
  },
  draw: {
    d: "M100,380 C65,50 70,10 100, 145",
    class: "draw",
  },
  push: {
    d: "M100,380 C125,50 150,5 140, 145",
    class: "push",
  },
  pull: {
    d: "M100,380 C75,50 50,5 60,145",
    class: "pull",
  },
  slice: {
    d: "M100,380 C25,200 10,10 160,145",
    class: "slice",
  },
  pushSlice: {
    d: "M100,380 C75,50 50,5 60,145",
    class: "push-slice",
  },
  hook: {
    d: "M100,380 C175,200 190,10 40,145",
    class: "hook",
  },
  pullHook: {
    d: "M100,380 C90,50 70,75 20,145",
    class: "pull-hook",
  },
};

// <path d="M100,380 C100,300 100,200 100,75" class="shot-path straight" />
//       <!-- Fade (curves gently to the right) -->
//       <path d="M100,380 C120,50 150,10 100,145" class="shot-path fade" />
//       <!-- Draw (curves gently to the left) -->
//       <path d="M100,380 C65,50 70,10 100, 145" class="shot-path draw" />

//       <path d="M100,380 C125,50 150,5 140, 145" class="shot-path push" />

//       <path d="M100,380 C75,50 50,5 60,145" class="shot-path pull" />
//       <!-- Slice (sharp curve right) -->
//       <path d="M100,380 C25,200 10,10 160,145" class="shot-path slice" />

//       <path d="M100,380 C110,50 130,75 180,145" class="shot-path push-slice" />
//       <!-- Hook (sharp curve left) -->
//       <path d="M100,380 C175,200 190,10 40,145" class="shot-path hook" />
//       <path d="M100,380 C90,50 70,75 20,145" class="shot-path pull-hook" />
