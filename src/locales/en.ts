export const en = {
  controls: {
    language: 'Language',
    roleLabel: 'Portfolio focus',
    roleCaption: 'Projects, experience, and approach below adapt to the selected role.',
  },
  roles: {
    ai: {
      label: 'AI Developer',
      headline:
        'I connect the model, interface, and infrastructure into one coherent product.',
      description:
        'I connect dependable AI systems with product experiences people can understand, question, and trust.',
    },
    frontend: {
      label: 'Frontend Developer',
      headline: 'I turn complex product logic into a simple, intuitive interface.',
      description:
        'I build expressive, resilient interfaces where visual detail and maintainable architecture reinforce each other.',
    },
  },
  hero: {
    availability: 'Open to ambitious product work',
    portraitAlt: 'Portrait of Alexander Popoff',
    coreStack: 'Core stack',
    chatSoon: 'AI persona — coming next',
  },
  proof: {
    title: 'System signals',
    status: 'live',
    role: 'One body of work, two professional lenses',
    delivery: 'From interfaces and agents to edge infrastructure',
    languages: 'Equal product experience',
  },
  projects: {
    kicker: 'Selected systems',
    title: 'Every project below shows the challenge, solution, and result.',
    watch: 'Watch presentation',
    posterAlt: 'TTLock Connector interface from the Bitrix24 application suite',
    localPosterAlt: 'Local AI Assistant extension interface',
    shortSportPosterAlt: 'ShortSport AI Forge storyboard editor interface',
    videoTranscriberPosterAlt: 'Video Transcriber results dashboard interface',
    neurosportTmaPosterAlt: 'Neurosport Telegram Mini App prediction interface',
    todoPosterAlt: 'Todo App task list interface',
    readCloseBotPosterAlt: 'Read-Close-Bot AI agent architecture',
    neurosportPosterAlt: 'Neurosport new sport prediction platform',
    neuralGridPosterAlt: 'NeuralGrid International technology landing',
    energoAiPosterAlt: 'EnergoAI energy intelligence product site',
    architecturePreview: 'Agent architecture',
    liveDemo: 'Live demo',
  },
  method: {
    frontend: {
      kicker: 'FRONTEND DEVELOPMENT',
      title: 'From task to working interface.',
      items: [
        {
          title: 'Understand the task',
          text: 'I review the requirements, user flow, and current implementation before starting development.',
          details: [
            'Review requirements and mockups',
            'Study the existing code and project structure',
            'Check API, SDK, and environment constraints',
            'Clarify the expected result and key scenarios',
          ],
        },
        {
          title: 'Build the interface',
          text: 'I split the interface into clear parts, connect the data, and implement user flows step by step.',
          details: [
            'Split the interface into pages and components',
            'Describe data and API contracts with TypeScript',
            'Connect REST APIs, SDKs, and external services',
            'Manage state with composables, hooks, or a store',
          ],
        },
        {
          title: 'Verify the result',
          text: 'I check the main flows, interface states, and whether the project is ready for a production build.',
          details: [
            'Add loading, error, empty, and retry states',
            'Use mocks for development and testing',
            'Verify flows with Vitest and Playwright',
            'Run the production build and check responsive behavior',
          ],
        },
      ],
    },
    ai: {
      kicker: 'AI DEVELOPMENT',
      title: 'From task to controlled AI system.',
      items: [
        {
          title: 'Define the AI flow',
          text: 'I examine the task, input data, and expected result before choosing a model or tools.',
          details: [
            'Define the user flow and useful outcome',
            'Check the sources and input-data format',
            'Record constraints and what the model must not do',
            'Choose clear criteria for evaluating the response',
          ],
        },
        {
          title: 'Build the AI pipeline',
          text: 'I connect the model, prompt, tools, and APIs into a controlled application flow.',
          details: [
            'Connect LLMs through a server-side provider API',
            'Use LangGraph and tool calling when the flow requires them',
            'Validate structured responses with types and Zod',
            'Keep provider keys and model calls on the backend or Worker',
          ],
        },
        {
          title: 'Verify and protect',
          text: 'I check model responses, failure scenarios, and the reliability of the AI feature in production.',
          details: [
            'Validate model inputs and outputs',
            'Add retries, fallbacks, and error handling',
            'Use rate limits, audit trails, and safe kill switches',
            'Separate verified data from model interpretation',
          ],
        },
      ],
    },
  },
  flipCard: {
    reveal: 'View details',
    collapse: 'Back to overview',
    revealLabel: 'View details: {{title}}',
    collapseLabel: 'Back to overview: {{title}}',
  },
  experience: {
    kicker: 'Professional foundation',
    title: 'Experience, education, practice.',
  },
  aiPreview: {
    kicker: 'The portfolio answers',
    title: 'Meet Bob.',
    text: 'Bob has studied Alexander’s projects, résumé, and verified professional facts, so he answers with evidence. If the facts are missing, he says so. Inventing experience is forbidden; the occasional dry joke is still within policy.',
    label: 'Grounded portfolio assistant',
    placeholder: 'Which projects match my vacancy?',
  },
  bob: {
    name: 'Bob',
    title: 'Bob — portfolio assistant',
    status: 'online · answers with sources',
    start: 'Open full chat',
    open: 'Open chat with Bob',
    close: 'Close chat',
    ask: 'Ask a question',
    vacancy: 'Check a vacancy',
    vacancyActive: 'Vacancy mode',
    mode: 'Conversation mode',
    welcome:
      'Hi! I know the verified material in this portfolio and never pad the experience — not even to be polite.',
    disclaimer:
      'Bob answers from verified portfolio material and may make interpretation mistakes.',
    you: 'You',
    retrieving: 'Finding evidence…',
    thinking: 'Bob is composing an answer from the retrieved sources',
    sources: 'Answer sources',
    sourcesCount: 'Sources · {{count}}',
    placeholder: 'For example: which projects demonstrate AI agent experience?',
    vacancyPlaceholder: 'Paste the full vacancy description…',
    send: 'Send',
    stop: 'Stop',
    retry: 'Retry',
    challenge: 'Security check',
    challengeUnavailable:
      'The verification is temporarily unavailable. Please try again shortly.',
    suggestions: [
      'Which AI projects can I verify?',
      'What Cloudflare experience is documented?',
      'What is relevant to a Frontend role?',
    ],
    errors: {
      validation: 'Check the message length and format.',
      no_evidence: 'I do not have verified evidence to answer that accurately.',
      rate_limit: 'Too many requests. Give Bob a minute to catch his breath.',
      challenge_required: 'Please verify that you are human, then retry.',
      provider_auth: 'The answer service is temporarily not authorized.',
      provider_unavailable: 'The AI service is unavailable right now. You can retry.',
      stream_interrupted: 'The connection ended before the answer was complete.',
    },
  },
  contact: {
    kicker: 'Contact',
    title: 'Let’s discuss the problem, not a list of technologies.',
    write: 'Get in touch',
  },
  project: {
    back: 'Back to overview',
    caseStudy: 'Foundation case study',
    notFound: 'Project not found',
    foundation:
      'A bilingual React and Cloudflare foundation designed to grow into a grounded AI portfolio without sacrificing clarity or craft.',
    task: 'Task',
    outcome: 'Outcome',
    taskOutcome: 'Task / Result',
    contribution: 'Contribution',
    decisions: 'Decisions',
    capabilities: 'Product scope',
    architecture: 'Architecture',
    verification: 'Verified evidence',
    evidenceTitle: 'What the implementation demonstrates',
    status: {
      productionIntegration: 'Production integration',
      productionUi: 'Production UI',
    },
  },
} as const;
