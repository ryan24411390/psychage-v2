# Cross-Flow Connection Matrix — Pre-Fix State

| From | To | Connection Point | Status | Notes |
|------|-----|-----------------|--------|-------|
| Navigator results | Articles | Condition-specific article links | ❌ | guide_path/coping_path exist on data but not rendered |
| Navigator results | Providers | "Find a Provider" CTA | ✅ | ns2 links to /providers/search |
| Navigator results | Save/Dashboard | Save results | N/A | Requires auth feature — out of scope |
| Navigator results | Start Over | Reset assessment | ⚠️ | Exists but only at bottom of page |
| Article page | Navigator | "Check your symptoms" CTA | ✅ | Toolkit CTA section includes Symptom Navigator |
| Article page | Providers | "Find a provider" CTA | ❌ | No provider CTA on articles |
| Article page | Related articles | Related articles section | ✅ | Grid of 3 related articles renders when available |
| Article page | Read Next | Sequential CTA | ❌ | No prominent "Read Next" after related articles |
| Tool completion | Articles | Suggested reading | ⚠️ | Some tools have ToolRecommendation, not all link to articles |
| Tool completion | Providers | Provider suggestion | ⚠️ | ToolRecommendation includes providers for low scores |
| Tool completion | Other tools | Cross-tool links | ✅ | ToolRecommendation handles this on most tools |
| Provider profile | Articles | Related conditions articles | ❌ | No educational content links on profiles |
| MindMate | Articles | Article links in chat | ❌ | Chat is isolated — no cross-links (feature, not fix) |
| MindMate | Providers | Provider search in chat | ❌ | Chat is isolated (feature, not fix) |
| MindMate | Crisis | Crisis detection response | ✅ | Inline crisis message with call button |
| Search (Cmd+K) | All content | Returns articles, providers, tools | ⚠️ | Search submits to /search route — coverage not audited |
| Relationship Health | Articles | Relationship articles | ❌ | No article link from results dashboard |

## Legend
- ✅ Connected and working
- ⚠️ Partially connected (exists but incomplete)
- ❌ Missing connection
- N/A Not applicable or out of scope
