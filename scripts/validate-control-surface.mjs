/**
 * Minimal validator for docs/ngl-control-surface.schema.json.
 * No dependency. Enforces the authority rule the schema's enums do not:
 * AUTHORIZED requires a human_authorization string, and a MODEL_PROPOSAL
 * cannot promote itself to AUTHORIZED.
 */

const REQUIRED = [
  "control_surface_id",
  "source_identity",
  "source_revision",
  "source_path",
  "class",
  "intended_consumer",
  "producer",
  "authority_claim",
  "actual_authority_status",
  "instruction_or_behavior_summary",
  "execution_effect",
  "persistence_effect",
  "created_at",
  "status",
  "provenance_parents",
];

const CLASSES = new Set([
  "NORMATIVE_SPEC",
  "AGENT_INSTRUCTION",
  "PERSISTENT_STATE",
  "EXECUTABLE_CONTROL",
  "MODEL_PROPOSAL",
  "CONNECTOR_INPUT",
  "REFERENCE",
]);

const AUTHORITY = new Set([
  "UNCLAIMED",
  "CLAIMED",
  "PROPOSED",
  "AUTHORIZED",
  "REJECTED",
  "SUPERSEDED",
  "UNKNOWN",
]);

const STATUS = new Set(["ACTIVE", "REJECTED", "SUPERSEDED", "ARCHIVED", "UNKNOWN"]);

export function validateControlSurface(obj) {
  const errors = [];
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return { ok: false, errors: ["not an object"] };
  }
  for (const key of REQUIRED) {
    if (obj[key] === undefined || obj[key] === null || obj[key] === "") {
      errors.push(`missing ${key}`);
    }
  }
  if (obj.class && !CLASSES.has(obj.class)) errors.push(`bad class ${obj.class}`);
  if (obj.actual_authority_status && !AUTHORITY.has(obj.actual_authority_status)) {
    errors.push(`bad actual_authority_status ${obj.actual_authority_status}`);
  }
  if (obj.status && !STATUS.has(obj.status)) errors.push(`bad status ${obj.status}`);
  if (obj.provenance_parents && !Array.isArray(obj.provenance_parents)) {
    errors.push("provenance_parents must be an array");
  }
  if (obj.actual_authority_status === "AUTHORIZED") {
    if (typeof obj.human_authorization !== "string" || obj.human_authorization.length === 0) {
      errors.push("AUTHORIZED requires human_authorization");
    }
  }
  if (obj.class === "MODEL_PROPOSAL" && obj.actual_authority_status === "AUTHORIZED") {
    errors.push("MODEL_PROPOSAL cannot be AUTHORIZED");
  }
  return { ok: errors.length === 0, errors };
}
