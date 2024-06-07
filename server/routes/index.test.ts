import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {},
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Given name')
        expect(res.text).toContain('Family name')
        expect(res.text).toContain('Gender')
        expect(res.text).toContain('Assessment ID')
        expect(res.text).toContain('Project')
      })
  })
})
