export interface CoupleSong {
  id: string;
  title: string;
  artist: string;
  note?: string;
  /** Enlace opcional (YouTube / Spotify). Si falta, se busca en YouTube. */
  url?: string;
}

/** Canciones que os flipan a los dos — banda sonora de M & R */
export const coupleSongs: CoupleSong[] = [
  {
    id: "dani-bailar",
    title: "Me has invitado a bailar",
    artist: "Dani Fernández",
    note: "Para cuando el mundo se reduce a dos y una pista.",
    url: "https://www.youtube.com/results?search_query=Dani+Fern%C3%A1ndez+Me+has+invitado+a+bailar",
  },
  {
    id: "iris",
    title: "Iris",
    artist: "The Goo Goo Dolls",
    note: "La que os parte por la mitad… y os vuelve a juntar.",
    url: "https://www.youtube.com/results?search_query=The+Goo+Goo+Dolls+Iris",
  },
  {
    id: "wonderwall",
    title: "Wonderwall",
    artist: "Oasis",
    note: "Clásico eterno. Porque somehow, somehow you feel the feeling.",
    url: "https://www.youtube.com/results?search_query=Oasis+Wonderwall",
  },
];
