import { Tattoo, TattooList } from './interfaces';

// Tattoo lists of the menu (PRODUCTION-SERVER#12). Pure: they never change the list or the tattoo they get, so the
// menu's state, the list it sends to the game and the shop's tattoo list stay separate objects.

/** Zone of the hair fades: one at a time, picked at the barber, kept by "delete all" */
export const FADE_ZONE = 'ZONE_HAIR';

/** "Apply": the list with this tattoo at this opacity, once (a tattoo already there gets the new opacity in place) */
export const withTattoo = (tattoos: TattooList, tattoo: Tattoo, opacity: number): TattooList => {
  const applied = { ...tattoo, opacity };
  const zone = tattoos[tattoo.zone] ?? [];
  const index = zone.findIndex(t => t.name === tattoo.name);
  const updated = index === -1 ? [...zone, applied] : zone.map((t, i) => (i === index ? applied : t));
  return { ...tattoos, [tattoo.zone]: updated };
};

/** "Delete": the list without this tattoo */
export const withoutTattoo = (tattoos: TattooList, tattoo: Tattoo): TattooList => ({
  ...tattoos,
  [tattoo.zone]: (tattoos[tattoo.zone] ?? []).filter(t => t.name !== tattoo.name),
});

/** "Delete all": every zone emptied but the hair fade */
export const withoutTattoos = (tattoos: TattooList): TattooList => {
  const updated: TattooList = {};
  for (const zone of Object.keys(tattoos)) {
    updated[zone] = zone === FADE_ZONE ? tattoos[zone] : [];
  }
  return updated;
};

/** Hair fade picked at the barber: it replaces the previous one */
export const withFade = (tattoos: TattooList, fade: Tattoo): TattooList => ({ ...tattoos, [fade.zone]: [fade] });

/** Tattoo shown at this opacity while it is chosen in the list (a copy: the shop's list keeps its own) */
export const previewOf = (tattoo: Tattoo, opacity: number): Tattoo => ({ ...tattoo, opacity });
