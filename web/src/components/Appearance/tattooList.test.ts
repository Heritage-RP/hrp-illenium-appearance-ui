import { describe, expect, it } from 'vitest';
import { Tattoo, TattooList } from './interfaces';
import { previewOf, withFade, withoutTattoo, withoutTattoos, withTattoo } from './tattooList';

const tattoo = (name: string, zone = 'ZONE_TORSO'): Tattoo => ({
  name,
  label: name,
  hashMale: `${name}_M`,
  hashFemale: `${name}_F`,
  zone,
  collection: 'mpairraces_overlays',
  opacity: 0.1,
});

const A = tattoo('TAT_AR_000');
const B = tattoo('TAT_AR_001');
const C = tattoo('TAT_AR_010', 'ZONE_HEAD');
const FADE = tattoo('FADE_1', 'ZONE_HAIR');
const FADE_2 = tattoo('FADE_2', 'ZONE_HAIR');

const names = (list: TattooList, zone: string) => (list[zone] ?? []).map(t => t.name);

describe('withTattoo (Apply)', () => {
  it('keeps the tattoos already applied: a second one adds to the first (PRODUCTION-SERVER#12)', () => {
    const one = withTattoo({}, A, 0.1);
    const two = withTattoo(one, B, 0.1);
    const three = withTattoo(two, C, 0.5);
    expect(names(three, 'ZONE_TORSO')).toEqual([A.name, B.name]);
    expect(names(three, 'ZONE_HEAD')).toEqual([C.name]);
  });

  it('applies a tattoo once: a second click updates its opacity in place', () => {
    const list = withTattoo(withTattoo(withTattoo({}, A, 0.1), B, 0.1), A, 0.8);
    expect(names(list, 'ZONE_TORSO')).toEqual([A.name, B.name]);
    expect(list.ZONE_TORSO[0].opacity).toBe(0.8);
  });

  it('changes neither the list nor the shop tattoo it gets', () => {
    const before: TattooList = { ZONE_TORSO: [A] };
    const shopItem = { ...B };
    const after = withTattoo(before, shopItem, 0.7);
    expect(before).toEqual({ ZONE_TORSO: [A] });
    expect(shopItem.opacity).toBe(0.1);
    expect(after.ZONE_TORSO[1]).not.toBe(shopItem);
    expect(after.ZONE_TORSO[1].opacity).toBe(0.7);
  });

  it('accepts the empty list the game sends as a JSON array', () => {
    const fromGame = [] as unknown as TattooList;
    expect(names(withTattoo(fromGame, A, 0.1), 'ZONE_TORSO')).toEqual([A.name]);
  });
});

describe('previewOf', () => {
  it('moving the opacity of a chosen tattoo does not change the applied one', () => {
    const shopItem = { ...A };
    const applied = withTattoo({}, shopItem, 0.2);
    const preview = previewOf(shopItem, 0.9);
    expect(preview.opacity).toBe(0.9);
    expect(applied.ZONE_TORSO[0].opacity).toBe(0.2);
    expect(shopItem.opacity).toBe(0.1);
  });
});

describe('withoutTattoo (Delete)', () => {
  it('removes only this tattoo', () => {
    const list = withoutTattoo({ ZONE_TORSO: [A, B], ZONE_HEAD: [C] }, A);
    expect(names(list, 'ZONE_TORSO')).toEqual([B.name]);
    expect(names(list, 'ZONE_HEAD')).toEqual([C.name]);
  });

  it('does not change the menu state it gets', () => {
    const state: TattooList = { ZONE_TORSO: [A, B] };
    withoutTattoo(state, A);
    expect(names(state, 'ZONE_TORSO')).toEqual([A.name, B.name]);
  });

  it('ignores a zone without tattoos', () => {
    expect(withoutTattoo({}, A)).toEqual({ ZONE_TORSO: [] });
  });
});

describe('withoutTattoos (Delete all)', () => {
  it('empties every zone but the hair fade', () => {
    const state: TattooList = { ZONE_TORSO: [A, B], ZONE_HEAD: [C], ZONE_HAIR: [FADE] };
    const list = withoutTattoos(state);
    expect(list).toEqual({ ZONE_TORSO: [], ZONE_HEAD: [], ZONE_HAIR: [FADE] });
    expect(names(state, 'ZONE_TORSO')).toEqual([A.name, B.name]);
  });
});

describe('withFade (barber)', () => {
  it('replaces the previous fade and keeps the tattoos', () => {
    const list = withFade({ ZONE_TORSO: [A], ZONE_HAIR: [FADE] }, FADE_2);
    expect(names(list, 'ZONE_HAIR')).toEqual([FADE_2.name]);
    expect(names(list, 'ZONE_TORSO')).toEqual([A.name]);
  });
});
