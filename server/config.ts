const production = process.env.NODE_ENV === 'production'

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  // Sets the working socket to timeout after timeout milliseconds of inactivity on the working socket.
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    // sets maximum time to wait for the first byte to arrive from the server, but it does not limit how long the
    // entire download can take.
    response: number
    // sets a deadline for the entire request (including all uploads, redirects, server processing time) to complete.
    // If the response isn't fully downloaded within that time, the request will be aborted.
    deadline: number
  }
  agent: AgentConfig
}

const auditConfig = () => {
  const auditEnabled = get('AUDIT_ENABLED', 'false') === 'true'
  return {
    enabled: auditEnabled,
    queueUrl: get(
      'AUDIT_SQS_QUEUE_URL',
      'http://localhost:4566/000000000000/mainQueue',
      auditEnabled && requiredInProduction,
    ),
    serviceName: get('AUDIT_SERVICE_NAME', 'UNASSIGNED', auditEnabled && requiredInProduction),
    region: get('AUDIT_SQS_REGION', 'eu-west-2'),
  }
}

export default {
  production,
  https: production,
  staticResourceCacheDuration: '1h',
  redis: {
    enabled: get('REDIS_ENABLED', 'false', requiredInProduction) === 'true',
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9091/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000))),
      systemClientId: get('SYSTEM_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('SYSTEM_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    coordinatorApi: {
      url: get('COORDINATOR_API_URL', 'http://localhost:8070', requiredInProduction),
      timeout: {
        response: Number(get('COORDINATOR_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('COORDINATOR_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('COORDINATOR_API_TIMEOUT_RESPONSE', 10000))),
    },
    handoverApi: {
      url: get('HMPPS_ARNS_HANDOVER_URL', 'http://localhost:7070/oauth2/authorize', requiredInProduction),
      externalUrl: get(
        'HMPPS_ARNS_HANDOVER_EXTERNAL_URL',
        get('HMPPS_ARNS_HANDOVER_URL', 'http://localhost:9090/auth'),
      ),
      timeout: {
        response: Number(get('HMPPS_ARNS_HANDOVER_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_ARNS_HANDOVER_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_ARNS_HANDOVER_TIMEOUT_RESPONSE', 10000))),
    },
  },
  sentencePlan: {
    clientId: get('SP_HANDOVER_CLIENT_ID', 'sentence-plan'),
    redirectUri: get('SP_HANDOVER_REDIRECT_URI', 'http://localhost:3000/sign-in/callback'),
  },
  strengthsAndNeeds: {
    clientId: get('SAN_HANDOVER_CLIENT_ID', 'strengths-and-needs-assessment'),
    redirectUri: get('SAN_HANDOVER_REDIRECT_URI', 'http://localhost:3000/sign-in/callback'),
  },
  arnsAssessmentPlatform: {
    clientId: get('AAP_HANDOVER_CLIENT_ID', 'arns-assessment-platform'),
    redirectUri: get('AAP_HANDOVER_REDIRECT_URI', 'http://localhost:3000/sign-in/callback'),
  },
  sqs: {
    audit: auditConfig(),
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  environmentName: get('ENVIRONMENT_NAME', ''),
  deploymentName: get('DEPLOYMENT_NAME', ''),
}
