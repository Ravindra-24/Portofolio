import { parseUtmParameters } from './utm'

describe('UTM attribution', () => {
  test('extracts supported campaign parameters', () => {
    expect(
      parseUtmParameters(
        '?utm_source=linkedin&utm_medium=social&utm_campaign=hiring&ignored=1'
      )
    ).toEqual({
      utm_source: 'linkedin',
      utm_medium: 'social',
      utm_campaign: 'hiring',
    })
  })

  test('ignores empty and unsupported parameters', () => {
    expect(parseUtmParameters('?utm_source=&ref=profile')).toEqual({})
  })
})
