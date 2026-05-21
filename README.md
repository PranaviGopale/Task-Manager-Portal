# Enterprise Task Allocation & State Management Portal

A robust, production-ready full-stack task management engine designed for secure role-based task distribution, live administrative operations, and real-time client-side synchronization. Built with a decoupled architecture pattern featuring an Express.js/SQLite3 micro-backend and a high-performance Vanilla JS responsive interface.

---

## ⚡ Core Engineering Features

* **Role-Based Access Control (RBAC):** Cryptographically simulates state verification middleware. Administrative tiers retain global creation/override scopes, while Member accounts are strictly locked to individual task assignments.
* **Live Aggregation Engine:** Processes active database records on-the-fly to stream calculated performance metrics (Total, In Progress, Completed counters) instantly to the view layer.
* **Dynamic Dataset Parsing:** Implements client-side lookahead streaming to allow users to filter hundreds of tasks instantly without triggering redundant database read bottlenecks.
* **Fail-Safe Recovery Pipeline:** Implements a secondary lookup routing architecture to safely handle credential lookup operations during account lockouts.
* **Adaptive User Interface:** Native viewport optimization utilizing dynamic CSS variable themes, smooth cubic-bezier micro-animations, and conditional UI state rendering.

---

## ⚙️ System Workflow Topology

```text
[ Client View Layer (HTML5/CSS3/JS) ]
                 │
                 ▼ Async Fetch API Pipeline (RESTful JSON)
[ Routing & Auth Controller (Express.js) ] ──► [ Global Session Cache ]
                 │
                 ▼ Structured SQL Statements
[ Relational Persistence Layer (SQLite3 tasks.db) ]