# The image that the CI and release jobs run in, so they don't install their
# dependencies on every run. The ci-image workflow publishes it to GHCR tagged
# with a hash of this directory, so any change here ships a new image on the
# next CI run. Bump REFRESHED to pick up newer packages without other changes.
#
# Ubuntu 26.04 because `gnome-extensions upload`, which the release job uses,
# first shipped in GNOME 49.
FROM ubuntu:26.04

ARG DEBIAN_FRONTEND=noninteractive
ARG REFRESHED=2026-09-26

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        gettext \
        git \
        gnome-shell \
        jq \
        libglib2.0-bin \
        nodejs \
        zip \
    && rm -rf /var/lib/apt/lists/* \
    && gnome-extensions version \
    && node --version
