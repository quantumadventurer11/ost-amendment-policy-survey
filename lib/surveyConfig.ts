import type { QuestionOption, SurveyConfig, SurveyQuestion, SurveySection } from "./surveyTypes";

const opt = (label: string): QuestionOption => ({ label, value: label });

const q = (
  sectionId: string,
  id: string,
  title: string,
  type: SurveyQuestion["type"],
  options: string[] = [],
  extra: Partial<SurveyQuestion> = {},
): SurveyQuestion => ({
  id,
  sectionId,
  title,
  type,
  options: options.map(opt),
  required: type !== "textarea" && !id.endsWith(".comment"),
  allowOther: false,
  tags: extra.tags ?? [],
  analysisCategory: extra.analysisCategory ?? sectionId,
  ...extra,
});

const sectionMeta = {
  s2: {
    authorAttribution:
      "Benjamin analyzed Article I and emphasized that benefit of all countries is vague and should be clarified. The analysis argues that mature soft-law norms should be formalized, and that benefit may be understood as shared public goods such as scientific data, capacity-building, essential services, and protection of the space environment.",
  },
  s3: {
    authorAttribution:
      "Asher analyzed Article II and identified the core tension between non-appropriation and resource extraction. He noted that resource use may make literal equal access impossible and raised safety zones as a practical tool. Benjamin also raised questions about temporary control, leases, and what happens to assets after a lease expires.",
    nationalLegislationComparison:
      "The United States and Japan permit ownership of extracted space resources through national legislation. Luxembourg has a similar model. China, Russia, and many Global South perspectives tend to favor a more multilateral or common-heritage approach. The Artemis Accords state that resource extraction does not inherently constitute national appropriation if conducted consistently with the OST.",
  },
  s4: {
    authorAttribution:
      "Andrew analyzed Article III and emphasized that it imports international law and the UN Charter into outer space, but leaves grey-zone activities unclear. Nicolas analyzed Article IV and identified ambiguity around peaceful purposes, WMDs, conventional weapons, dual-use satellites, ASAT capabilities, directed-energy weapons, and military use of orbital space.",
  },
  s5: {
    authorAttribution:
      "Christopher and Prranav analyzed Article V and highlighted the need to clarify rescue duties for commercial astronauts, tourists, private crew, biological systems essential to survival, and emergency logistics.",
    artemisComparison:
      "The Artemis Accords reaffirm emergency assistance and reasonable efforts to help astronauts in distress.",
  },
  s6: {
    authorAttribution:
      "Christopher and Prranav analyzed Article VI and identified uncertainty around continuing supervision. Asher and Benjamin raised whether states should remain fully liable for private companies, with Benjamin emphasizing that state responsibility creates incentives to control risky behavior.",
    nationalLegislationComparison:
      "The United States, Japan, India, and UAE use licensing frameworks for private space activities. India's IN-SPACe model separates promotion and authorization functions. National models vary in how much supervision is required after launch.",
  },
  s7: {
    authorAttribution:
      "Christopher and Prranav analyzed liability and noted that the Liability Convention provides procedures, but diplomatic resolution and non-binding Claims Commission outcomes may be insufficient. Chris specifically noted that there needs to be a proper structure when states refuse responsibility and asked whether an independent forensic body should assess damage.",
  },
  s8: {
    authorAttribution:
      "Jeeval analyzed Article VIII and proposed adapting a maritime-style re-flagging system for space objects, while preventing flags of convenience through legitimacy, economic viability, and technical safety tests.",
  },
  s9: {
    authorAttribution:
      "Prranav and Christopher analyzed Article IX and proposed clearer definitions for harmful contamination, adverse environmental change, due regard, consultation, and risk mitigation. Their draft language would require good-faith consultation where activities create foreseeable and material interference.",
    artemisComparison:
      "The Artemis Accords include deconfliction through public information, coordination, and temporary safety zones. They also include orbital debris mitigation and end-of-mission disposal planning.",
  },
  s10: {
    authorAttribution:
      "Quill and Benjamin analyzed Articles X, XI, and XII. They identified weak enforcement in Articles X and XI and argued that shall consider and to the greatest extent feasible and practicable create loopholes. They suggested changing Article X toward shall notify, while preserving some national security discretion under Article XI.",
    artemisComparison:
      "The Artemis Accords emphasize transparency, public dissemination of policies and plans, registration, and sharing scientific data.",
  },
  s11: {
    authorAttribution:
      "Amara analyzed Article XIII and identified responsibility diffusion where states act through international organizations or joint missions. Her analysis recommends clearer procedures, timelines, and forums for resolving responsibility and liability questions.",
  },
  s12: {
    authorAttribution:
      "Derrick and Justice analyzed the final clauses and argued that the treaty's depositary structure reflects the 1960s Cold War order. They suggested modernizing depositary functions, amendment procedures, and withdrawal rules.",
  },
};

// To revise the survey safely: edit question text/options here, preserve stable IDs for analysis continuity,
// increment surveyVersion, update lastUpdated, and add a changeLog entry describing the policy or wording change.
export const surveyConfig: SurveyConfig = {
  surveyVersion: "1.0",
  lastUpdated: "2026-05-18",
  changeLog: [
    {
      version: "1.0",
      date: "2026-05-18",
      summary: "Initial consultation instrument for OST amendment policy research.",
    },
  ],
  sections: [
    {
      id: "s0",
      title: "Respondent Information",
      context: "Optional identifying information helps the research team interpret expertise and institutional perspective. Anonymous submissions are accepted.",
      questions: [
        q("s0", "respondent_name", "Name", "text", [], { required: false, placeholder: "Optional" }),
        q("s0", "respondent_email", "Email", "text", [], { required: false, placeholder: "Optional" }),
        q("s0", "respondent_role", "Role or affiliation", "text", [], { required: false, placeholder: "Optional" }),
        q("s0", "respondent_type", "Are you responding as an individual or on behalf of an organization?", "radio", [
          "Individual",
          "Organization",
          "Unsure / prefer not to say",
        ]),
      ],
    },
    {
      id: "s1",
      title: "Overall Direction of OST Reform",
      context:
        "This survey asks the team to choose policy decisions related to amending the Outer Space Treaty. The project is intended to support a future gap analysis that may lead to a proposed new treaty, a protocol to the OST, or endorsement of an international framework such as the Artemis Accords.",
      questions: [
        q("s1", "1.1", "What should be the primary diplomatic objective of this project?", "radio", [
          "Draft a new treaty replacing or supplementing the OST",
          "Draft an amendment protocol to the OST",
          "Promote soft-law guidelines through COPUOS",
          "Endorse the Artemis Accords with recommended clarifications",
          "Develop a hybrid approach combining treaty reform and Artemis Accords principles",
          "Unsure",
        ]),
        q("s1", "1.2", "How ambitious should the proposed reform be?", "radio", [
          "Minimal: clarify existing treaty language only",
          "Moderate: add binding standards on resources, debris, supervision, and transparency",
          "High: create new institutions for licensing, dispute resolution, and benefit-sharing",
          "Transformational: create a comprehensive new celestial governance regime",
        ]),
        q("s1", "1.3", "Please explain your reasoning.", "textarea", [], { required: false, placeholder: "Add reasoning or caveats." }),
      ],
    },
    {
      id: "s2",
      title: "Article I - Benefit of All Countries and Freedom of Use",
      ...sectionMeta.s2,
      questions: [
        q("s2", "2.1", "Should Article I be amended to define benefit of all countries?", "radio", [
          "Yes, define it as shared public goods",
          "Yes, define it as material benefit-sharing or redistribution",
          "Yes, define it as both public goods and redistribution",
          "No, leave it flexible",
          "Unsure",
        ]),
        q("s2", "2.2", "Which benefit-sharing model should be preferred?", "radio", [
          "Open scientific data and capacity-building only",
          "Financial royalties from commercial extraction",
          "International fund for non-spacefaring states",
          "Technology transfer and infrastructure access",
          "Case-by-case benefit commitments in mission licensing",
          "Other",
        ], { allowOther: true }),
        q("s2", "2.3", "Should mature soft-law norms, such as debris mitigation and registration practice, be codified into binding treaty obligations?", "radio", [
          "Yes",
          "Yes, but only for widely accepted norms",
          "No, keep them voluntary",
          "Unsure",
        ]),
        q("s2", "2.4", "Written comment:", "textarea", [], { required: false }),
      ],
    },
    {
      id: "s3",
      title: "Article II - Non-Appropriation, Resource Extraction, and Safety Zones",
      ...sectionMeta.s3,
      questions: [
        q("s3", "3.1", "Should the amended OST explicitly state that private actors cannot claim ownership of celestial territory?", "radio", [
          "Yes, prohibit private territorial claims completely",
          "Yes, but allow temporary operational control",
          "No, private territorial property should be possible under regulation",
          "Unsure",
        ]),
        q("s3", "3.2", "Should extraction and ownership of space resources be allowed?", "radio", [
          "Yes, private ownership of extracted resources should be allowed",
          "Yes, but subject to international licensing and benefit-sharing",
          "Yes, but only for scientific and survival purposes",
          "No, extracted resources should remain common heritage",
          "Unsure",
        ]),
        q("s3", "3.3", "Which model should guide resource governance?", "radio", [
          "U.S./Japan model: national licensing and private ownership of extracted resources",
          "UNCLOS-inspired model: international authority and benefit-sharing",
          "Hybrid model: national licensing plus international registration, royalties, and oversight",
          "Artemis Accords model: resource extraction allowed with transparency and deconfliction",
          "Unsure",
        ]),
        q("s3", "3.4", "Should safety zones be recognized in the amended OST?", "radio", [
          "Yes, as temporary non-sovereign operational zones",
          "Yes, but only with international approval",
          "Yes, but only for safety and non-interference, not resource priority",
          "No, they risk becoming territorial claims",
          "Unsure",
        ]),
        q("s3", "3.5", "If safety zones are allowed, what limits should apply?", "checkbox", [
          "Fixed maximum duration",
          "Public notification",
          "UN registration",
          "Scientific and engineering justification",
          "Non-exclusive access except where safety requires limitation",
          "Periodic review",
          "Independent dispute mechanism",
          "Compensation or benefit-sharing for exclusive use of scarce locations",
        ]),
        q("s3", "3.6", "Written comment:", "textarea", [], { required: false }),
      ],
    },
    {
      id: "s4",
      title: "Articles III and IV - International Law, Peaceful Purposes, and Space Security",
      ...sectionMeta.s4,
      questions: [
        q("s4", "4.1", "Should Article IV be amended to ban conventional weapons in orbit, not only weapons of mass destruction?", "radio", [
          "Yes, ban all weapons in orbit",
          "Yes, ban destructive weapons such as ASATs and kinetic systems",
          "No, keep the WMD-only prohibition",
          "Unsure",
        ]),
        q("s4", "4.2", "How should the treaty treat dual-use systems such as communications, navigation, rendezvous, proximity operations, robotic arms, and servicing satellites?", "radio", [
          "Permit them but require transparency and notification",
          "Permit them with inspection and verification",
          "Restrict military use but allow civilian use",
          "Ban high-risk dual-use capabilities",
          "Unsure",
        ]),
        q("s4", "4.3", "Should destructive ASAT testing be explicitly prohibited?", "radio", [
          "Yes, all destructive ASAT testing should be banned",
          "Yes, debris-generating ASAT testing should be banned",
          "No, existing law is sufficient",
          "Unsure",
        ]),
        q("s4", "4.4", "Should the amended OST define peaceful purposes as non-aggressive or non-military?", "radio", [
          "Non-aggressive",
          "Non-military",
          "Different standards for orbit and celestial bodies",
          "Unsure",
        ]),
        q("s4", "4.5", "Written comment:", "textarea", [], { required: false }),
      ],
    },
    {
      id: "s5",
      title: "Article V - Astronaut Rescue and Emergency Assistance",
      ...sectionMeta.s5,
      questions: [
        q("s5", "5.1", "Should rescue obligations apply to all humans in space, including private astronauts and tourists?", "radio", [
          "Yes, all humans in space",
          "Yes, but only licensed mission participants",
          "No, only professional astronauts",
          "Unsure",
        ]),
        q("s5", "5.2", "Should the treaty clarify cost-sharing or reimbursement for rescue operations?", "radio", [
          "Yes, rescuing states should be reimbursed",
          "Yes, but reimbursement should never delay rescue",
          "No, rescue should remain purely humanitarian",
          "Unsure",
        ]),
        q("s5", "5.3", "Should emergency assistance include biological systems essential to survival, such as crops, life-support cultures, or habitat ecosystems?", "radio", [
          "Yes",
          "Yes, but only where human life is at risk",
          "No",
          "Unsure",
        ]),
        q("s5", "5.4", "Written comment:", "textarea", [], { required: false }),
      ],
    },
    {
      id: "s6",
      title: "Article VI - State Responsibility and Continuing Supervision",
      ...sectionMeta.s6,
      questions: [
        q("s6", "6.1", "Should the amended OST define continuing supervision?", "radio", [
          "Yes, with minimum global standards",
          "Yes, but leave implementation to national law",
          "No, flexibility is necessary",
          "Unsure",
        ]),
        q("s6", "6.2", "Which supervisory tools should be required?", "checkbox", [
          "Pre-launch licensing",
          "Mission risk assessment",
          "Environmental impact assessment",
          "Insurance proof",
          "Periodic reporting",
          "Real-time monitoring for high-risk missions",
          "Authority to suspend or terminate operations",
          "End-of-life disposal plan",
          "Public registry entry",
        ]),
        q("s6", "6.3", "Should states remain internationally responsible for private actors?", "radio", [
          "Yes, fully",
          "Yes, but with clearer indemnification against companies",
          "Partially, depending on state control",
          "No, private actors should bear direct international responsibility",
          "Unsure",
        ]),
        q("s6", "6.4", "Written comment:", "textarea", [], { required: false }),
      ],
    },
    {
      id: "s7",
      title: "Article VII - Liability and Compensation",
      ...sectionMeta.s7,
      questions: [
        q("s7", "7.1", "Should the OST system create a binding space claims tribunal?", "radio", [
          "Yes, binding tribunal",
          "Yes, but only after failed diplomacy",
          "No, keep current diplomatic model",
          "Unsure",
        ]),
        q("s7", "7.2", "Should there be an independent forensic body for space damage investigations?", "radio", [
          "Yes",
          "Yes, but only for major incidents",
          "No",
          "Unsure",
        ]),
        q("s7", "7.3", "Should operators be required to carry mandatory insurance?", "radio", [
          "Yes, all operators",
          "Yes, only commercial operators",
          "Yes, only high-risk missions",
          "No",
          "Unsure",
        ]),
        q("s7", "7.4", "Should there be a global compensation fund for victims of space-related damage?", "radio", [
          "Yes, funded by operators and launching states",
          "Yes, funded by states only",
          "No, insurance is enough",
          "No, current liability rules are enough",
          "Unsure",
        ]),
        q("s7", "7.5", "Written comment:", "textarea", [], { required: false }),
      ],
    },
    {
      id: "s8",
      title: "Article VIII - Registration, Jurisdiction, and Transfer of Space Objects",
      ...sectionMeta.s8,
      questions: [
        q("s8", "8.1", "Should space objects be able to change registry after launch?", "radio", [
          "Yes, through a regulated international transfer process",
          "Yes, through national approval only",
          "No, registry should remain fixed with the original launching state",
          "Unsure",
        ]),
        q("s8", "8.2", "What conditions should be required before registry transfer?", "checkbox", [
          "Consent of original state of registry",
          "Consent of acquiring state",
          "UN notification",
          "Technical safety assessment",
          "Economic viability test",
          "Proof of insurance",
          "End-of-life disposal plan",
          "No transfer of unsafe or orphaned assets",
          "Independent review panel approval",
        ]),
        q("s8", "8.3", "Should the treaty create rules against flags of convenience in space?", "radio", [
          "Yes",
          "Yes, but only for commercial operations",
          "No",
          "Unsure",
        ]),
        q("s8", "8.4", "Written comment:", "textarea", [], { required: false }),
      ],
    },
    {
      id: "s9",
      title: "Article IX - Due Regard, Harmful Interference, Environment, and Debris",
      ...sectionMeta.s9,
      questions: [
        q("s9", "9.1", "Should orbital debris be expressly included within the treaty's environmental obligations?", "radio", [
          "Yes, as harmful contamination",
          "Yes, as a separate debris obligation",
          "No",
          "Unsure",
        ]),
        q("s9", "9.2", "Should states be required to conduct environmental impact assessments before high-risk missions?", "radio", [
          "Yes, for all missions",
          "Yes, only high-risk or celestial-body missions",
          "No",
          "Unsure",
        ]),
        q("s9", "9.3", "Should consultation be mandatory before activities that may cause harmful interference?", "radio", [
          "Yes, with binding timelines",
          "Yes, but non-binding and diplomatic",
          "No",
          "Unsure",
        ]),
        q("s9", "9.4", "What should happen if a planned activity creates clearly disproportionate and unmitigable risk?", "radio", [
          "Activity must be modified",
          "Activity must be delayed",
          "Activity must be suspended",
          "Activity may proceed after notification",
          "Case-by-case determination by a neutral body",
        ]),
        q("s9", "9.5", "Written comment:", "textarea", [], { required: false }),
      ],
    },
    {
      id: "s10",
      title: "Articles X, XI, and XII - Transparency, Observation, Information Sharing, and Inspection",
      ...sectionMeta.s10,
      questions: [
        q("s10", "10.1", "Should Article X be amended from a weak observation/consideration standard to a mandatory launch notification rule?", "radio", [
          "Yes, all launches must be notified",
          "Yes, but classified details may be withheld",
          "No, current language is sufficient",
          "Unsure",
        ]),
        q("s10", "10.2", "Should Article XI keep a national security exception for classified missions?", "radio", [
          "Yes, broad exception",
          "Yes, narrow exception with confidential UN notification",
          "No, full transparency should be required",
          "Unsure",
        ]),
        q("s10", "10.3", "Should Article XII inspections apply to private and international lunar/celestial installations?", "radio", [
          "Yes, all installations",
          "Yes, but only through state representatives",
          "Yes, but with notice and confidentiality protections",
          "No",
          "Unsure",
        ]),
        q("s10", "10.4", "Should there be a neutral inspection body?", "radio", [
          "Yes, under COPUOS or UNOOSA",
          "Yes, independent treaty body",
          "No, inspections should remain reciprocal and state-based",
          "Unsure",
        ]),
        q("s10", "10.5", "Written comment:", "textarea", [], { required: false }),
      ],
    },
    {
      id: "s11",
      title: "Article XIII - International Organizations and Joint Missions",
      ...sectionMeta.s11,
      questions: [
        q("s11", "11.1", "Should multinational missions be required to pre-allocate liability among participating states?", "radio", [
          "Yes, by treaty rule",
          "Yes, through mission-specific agreements filed with the UN",
          "No, allow diplomatic resolution after incidents",
          "Unsure",
        ]),
        q("s11", "11.2", "Should international organizations be directly accountable under the OST framework?", "radio", [
          "Yes, directly accountable",
          "Partially, alongside member states",
          "No, only states should be accountable",
          "Unsure",
        ]),
        q("s11", "11.3", "Should Article XIII include procedures and timelines for resolving disputes?", "radio", [
          "Yes",
          "No",
          "Unsure",
        ]),
        q("s11", "11.4", "Written comment:", "textarea", [], { required: false }),
      ],
    },
    {
      id: "s12",
      title: "Articles XIV-XVII - Depositary, Amendment, Withdrawal, and Authentic Languages",
      ...sectionMeta.s12,
      questions: [
        q("s12", "12.1", "Should depositary responsibilities be transferred from the United States, United Kingdom, and Russia to a neutral UN body?", "radio", [
          "Yes, to the UN Secretary-General or UNOOSA",
          "Yes, to COPUOS",
          "No, keep the current depositaries",
          "Unsure",
        ]),
        q("s12", "12.2", "Should the OST amendment process be made easier?", "radio", [
          "Yes, supermajority voting",
          "Yes, protocol-based amendments",
          "Yes, periodic review conferences",
          "No, keep the current process",
          "Unsure",
        ]),
        q("s12", "12.3", "Should withdrawal rules be strengthened?", "radio", [
          "Yes, longer notice period",
          "Yes, continued obligations for existing missions",
          "Yes, review process before withdrawal takes effect",
          "No, keep current withdrawal rule",
          "Unsure",
        ]),
        q("s12", "12.4", "Should additional authentic treaty languages be recognized?", "checkbox", [
          "Arabic",
          "Hindi",
          "Japanese",
          "German",
          "Portuguese",
          "Korean",
          "Other",
          "No change",
        ], { allowOther: true }),
        q("s12", "12.5", "Written comment:", "textarea", [], { required: false }),
      ],
    },
    {
      id: "s13",
      title: "Artemis Accords",
      context:
        "NASA describes the Artemis Accords as a common set of principles to enhance governance of civil exploration and use of outer space. They reinforce the OST, Registration Convention, and Rescue and Return Agreement. They include peaceful purposes, transparency, interoperability, emergency assistance, registration, release of scientific data, preservation of space heritage, space resources, deconfliction through safety zones, and orbital debris mitigation.",
      questions: [
        q("s13", "13.1", "Do you support endorsing the Artemis Accords?", "radio", [
          "Yes, endorse fully",
          "Yes, endorse with clarifications",
          "Partially, use selected principles only",
          "No, pursue a UN-centered treaty instead",
          "Unsure",
        ]),
        q("s13", "13.2", "Which Artemis Accords policies do you accept?", "checkbox", [
          "Peaceful purposes",
          "Transparency",
          "Interoperability",
          "Emergency assistance",
          "Registration of space objects",
          "Release of scientific data",
          "Preservation of outer space heritage",
          "Space resource extraction and utilization",
          "Deconfliction of activities",
          "Safety zones",
          "Orbital debris mitigation",
          "End-of-mission disposal planning",
          "Use of Artemis as a stepping stone toward COPUOS negotiations",
        ]),
        q("s13", "13.3", "Which Artemis Accords policies do you reject or want clarified?", "checkbox", [
          "Safety zones",
          "Space resource extraction",
          "Non-binding structure",
          "U.S.-led diplomatic process",
          "Insufficient Global South participation",
          "Lack of enforcement",
          "Lack of benefit-sharing",
          "Insufficient environmental obligations",
          "Other",
        ], { allowOther: true }),
        q("s13", "13.4", "What conditions would make the Artemis Accords acceptable as an interim framework?", "checkbox", [
          "COPUOS review",
          "Added benefit-sharing language",
          "Clearer safety-zone limits",
          "Stronger anti-appropriation language",
          "Binding debris rules",
          "Open participation for all states",
          "Dispute-resolution mechanism",
          "Explicit path toward a multilateral treaty",
        ]),
        q("s13", "13.5", "Written comment:", "textarea", [], { required: false }),
      ],
    },
    {
      id: "s14",
      title: "Ranking Priority Amendments",
      questions: [
        q("s14", "14.1", "Rank the following proposed reforms from most important to least important.", "ranking", [
          "Clarify benefit-sharing",
          "Regulate resource extraction",
          "Define and limit safety zones",
          "Ban destructive ASAT testing",
          "Clarify peaceful purposes",
          "Extend rescue obligations",
          "Define continuing supervision",
          "Create liability tribunal",
          "Create global compensation fund",
          "Regulate registry transfers",
          "Add debris and environmental obligations",
          "Mandate launch transparency",
          "Create inspection mechanism",
          "Clarify joint mission responsibility",
          "Modernize depositary and amendment rules",
        ]),
      ],
    },
    {
      id: "s15",
      title: "Final Recommendation",
      questions: [
        q("s15", "15.1", "What final policy path should the team recommend?", "radio", [
          "New treaty",
          "OST amendment protocol",
          "COPUOS soft-law framework",
          "Artemis Accords endorsement",
          "Artemis Accords endorsement with amendments",
          "Hybrid treaty + Artemis pathway",
          "No recommendation yet",
        ]),
        q("s15", "15.2", "Please write your final recommendation in 3-6 sentences.", "textarea", [], {
          placeholder: "Summarize the recommended path and principal conditions.",
        }),
      ],
    },
  ],
};

export const allQuestions = surveyConfig.sections.flatMap((section) => section.questions);
export const requiredQuestions = allQuestions.filter((question) => question.required);
export const surveySectionById = new Map<string, SurveySection>(surveyConfig.sections.map((section) => [section.id, section]));
