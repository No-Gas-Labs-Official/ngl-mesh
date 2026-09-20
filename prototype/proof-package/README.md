# Proof-package CLI

This dependency-free Python 3.11 prototype turns a bounded evidence folder into a deterministic `proof-package.json`.

It is intentionally small enough to demo to a prospective design partner before building a hosted service. It hashes each input, records acceptance criteria, preserves failed/pending states, and makes clear that model or connector output cannot authorize acceptance.

## Run

```bash
python3 prototype/proof-package/proof_package.py ./sample-evidence \
  --job "Vendor diligence packet" \
  --criterion "Every material claim has a source" \
  --criterion "Conflicts are listed" \
  --out ./demo-output
```

The generated package is a starting artifact for a review UI and customer-facing acceptance receipt. It is not a truth guarantee and does not move money.
