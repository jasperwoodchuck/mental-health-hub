.PHONY: api app install dev

api:
	cd api && uv run uvicorn src.main:app --reload

app:
	cd app && bun run dev

install:
	cd api && uv sync
	cd app && bun install

dev:
	@echo "Run these in separate terminals:"
	@echo "make api"
	@echo "make app"
