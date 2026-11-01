import { test } from "node:test";
import assert from "node:assert/strict";
import { validateControlSurface } from "./validate-control-surface.mjs";

const base = {
  control_surface_id: "cs-readme",
  source_identity: "No-Gas-Labs-Official/ngl-mesh",
  source_revision: "837792a",
  source_path: "README.md",
  class: "REFERENCE",
  intended_consumer: "successor-agent",
  producer: "recovery-pass",
  authority_claim: "lineage note",
  actual_authority_status: "UNCLAIMED",
  instruction_or_behavior_summary: "Do not promote README claims to VERIFIED.",
  execution_effect: "none",
  persistence_effect: "git",
  created_at: "2026-09-13T20:35:01Z",
  status: "ACTIVE",
  provenance_parents: ["NGL_RELAY_v1.apk"],
};

test("a reference surface with parents validates", () => {
  assert.equal(validateControlSurface(base).ok, true);
});

test("AUTHORIZED without a human is rejected", () => {
  const result = validateControlSurface({
    ...base,
    actual_authority_status: "AUTHORIZED",
    human_authorization: null,
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes("AUTHORIZED requires human_authorization"));
});

test("a model proposal cannot authorize itself", () => {
  const result = validateControlSurface({
    ...base,
    class: "MODEL_PROPOSAL",
    actual_authority_status: "AUTHORIZED",
    human_authorization: "owner tap 2026-11-01",
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.includes("MODEL_PROPOSAL cannot be AUTHORIZED"));
});
