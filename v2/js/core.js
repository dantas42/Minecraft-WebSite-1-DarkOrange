(function () {
    "use strict";

    var config = window.SITE_CONFIG;
    if (!config) {
        return;
    }

    var serverAddress =
        config.server.port === 25565
            ? config.server.host
            : config.server.host + ":" + config.server.port;

    function setAll(selector, value) {
        document.querySelectorAll(selector).forEach(function (node) {
            node.textContent = value;
        });
    }

    function toast(message) {
        var node = document.querySelector(".toast");
        if (!node) {
            node = document.createElement("div");
            node.className = "toast";
            node.setAttribute("role", "status");
            node.setAttribute("aria-live", "polite");
            document.body.appendChild(node);
        }
        node.textContent = message;
        node.classList.add("is-visible");
        window.clearTimeout(toast.timer);
        toast.timer = window.setTimeout(function () {
            node.classList.remove("is-visible");
        }, 2200);
    }

    function copyLegacy(text) {
        var field = document.createElement("textarea");
        field.value = text;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        var copied = document.execCommand("copy");
        document.body.removeChild(field);
        return copied;
    }

    function copyIp() {
        var done = function () {
            toast("Server IP copied");
        };
        var failed = function () {
            toast("Copy failed. The IP is " + serverAddress);
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(serverAddress).then(done, function () {
                copyLegacy(serverAddress) ? done() : failed();
            });
            return;
        }

        copyLegacy(serverAddress) ? done() : failed();
    }

    function applyLinks() {
        document.querySelectorAll("[data-link]").forEach(function (node) {
            var url = config.links[node.getAttribute("data-link")];
            if (url) {
                node.setAttribute("href", url);
                return;
            }
            node.removeAttribute("href");
            node.removeAttribute("target");
            node.setAttribute("aria-disabled", "true");
            var holder = node.closest("li");
            if (holder) {
                holder.hidden = true;
            } else {
                node.hidden = true;
            }
        });

        document.querySelectorAll("[data-store]").forEach(function (node) {
            var url = config.links.store;
            if (!url) {
                node.removeAttribute("href");
                node.removeAttribute("target");
                node.hidden = false;
                node.classList.add("is-disabled");
                node.setAttribute("aria-disabled", "true");
                node.textContent = "Coming soon";
                return;
            }
            node.setAttribute("href", url);
        });
    }

    function renderStatus(state, label, players) {
        var status = document.querySelector("[data-status]");
        if (status) {
            status.classList.remove("is-online", "is-offline", "is-error");
            if (state) {
                status.classList.add("is-" + state);
            }
        }
        setAll("[data-server-status]", label);
        setAll("[data-players]", players ? players.online : "\u2014");
        setAll("[data-players-max]", players ? players.max : "\u2014");
    }

    function loadStatus() {
        var controller = new AbortController();
        var timer = window.setTimeout(function () {
            controller.abort();
        }, 8000);

        fetch("https://api.mcsrvstat.us/3/" + encodeURIComponent(serverAddress), {
            signal: controller.signal,
            headers: { Accept: "application/json" }
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("HTTP " + response.status);
                }
                return response.json();
            })
            .then(function (data) {
                if (!data.online) {
                    renderStatus("offline", "Offline");
                    return;
                }
                renderStatus("online", "Online", {
                    online: (data.players && data.players.online) || 0,
                    max: (data.players && data.players.max) || 0
                });
            })
            .catch(function () {
                renderStatus("error", "Unavailable");
            })
            .finally(function () {
                window.clearTimeout(timer);
                window.setTimeout(loadStatus, config.statusRefreshMs || 60000);
            });
    }

    setAll("[data-server-ip]", serverAddress);
    setAll("[data-year]", String(new Date().getFullYear()));
    applyLinks();

    document.querySelectorAll("[data-copy-ip]").forEach(function (node) {
        node.addEventListener("click", copyIp);
    });

    loadStatus();
})();
