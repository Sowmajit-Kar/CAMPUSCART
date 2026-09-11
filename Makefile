# =============================================================================
# CampusCart — Makefile
# Task automation for local development, serving, and Git operations
# =============================================================================

.PHONY: help dev serve install clean git-prep git-init

# Default target
help:
	@echo ================================================================
	@echo CampusCart Developer CLI Commands
	@echo ================================================================
	@echo   make dev       : Launch local frontend server on http://localhost:3000
	@echo   make serve     : Serve frontend via Python HTTP server
	@echo   make git-init  : Initialize local Git repository with main branch
	@echo   make git-prep  : Inspect git staging and verify .gitignore status
	@echo   make clean     : Remove temporary cache and log files
	@echo ================================================================

# Start dev server (serves frontend folder at port 3000)
dev:
	@echo Starting CampusCart frontend server on http://localhost:3000...
	python -m http.server 3000 --directory frontend

# Alternative serve command
serve:
	python -m http.server 3000 --directory frontend

# Initialize Git repository
git-init:
	git init -b main
	@echo Git repository initialized on branch 'main'.

# Check git status and ensure large videos are excluded
git-prep:
	@echo Checking Git status...
	git status

# Clean temporary files
clean:
	@echo Cleaning cache and log files...
	-del /q /s *.log 2>nul
	-rmdir /s /q .cache 2>nul
	@echo Clean complete.
