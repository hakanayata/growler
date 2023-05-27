document.addEventListener("click", (event) => {
    const originURL = window.location.origin
    const element = event.target

    if (element.id.startsWith("editBioBtn")) {
        const userID = element.dataset.id

        let bioEl;
        let bioDiv;
        let prevBio;

        // const bioEl = document.querySelector(`#bio-${userID}`)
        // const prevBio = bioEl.textContent
        // bioEl.style.display = "none"

        // todo: create bio div & its content if there's none
        if (document.querySelector(`#bio-${userID}`) == null) {
            bioDiv = document.createElement("div")
            bioDiv.setAttribute("id", `bio-parent-${userID}`)
            bioEl = document.createElement("p")
            bioEl.setAttribute("id", `bio-${userID}`)
            bioEl.textContent = ""
            prevBio = bioEl.textContent
            document.querySelector("h2").insertAdjacentElement("afterend", bioDiv)
        } else {
            bioEl = document.querySelector(`#bio-${userID}`)
            prevBio = bioEl.textContent
        }

        // todo: hide bio
        bioEl.style.display = "none"

        // todo: hide stats row
        const statsDiv = document.querySelector(`#user-stats-${userID}`)
        statsDiv.classList.replace("d-flex", "d-none")

        // todo: create text area pre-filled with prev. bio
        const textArea = document.createElement("textarea")
        textArea.setAttribute("class", "form-control border border-0 p-0 mb-2 shadow-sm")
        textArea.setAttribute("style", "resize: none; height: 76px; width: 320px;")
        textArea.required = true
        textArea.setAttribute("id", `new-bio-${userID}`)
        textArea.textContent = prevBio

        // todo: replace textarea with removed content element
        const parentDiv = document.querySelector(`#bio-parent-${userID}`)
        parentDiv.appendChild(textArea)

        // todo: create div for button
        const btnDiv = document.createElement("div")
        btnDiv.setAttribute("class", "d-flex justify-content-center align-items-center mb-1 w-100 gap-4")
        btnDiv.setAttribute("style", "height: 36px;")
        // add item not inside but next to parentDiv
        parentDiv.insertAdjacentElement("afterend", btnDiv)

        // todo: create a cancel btn
        const cancelBtn = document.createElement("button")
        cancelBtn.setAttribute("class", "btn btn-sm btn-secondary py-1 px-2 rounded-pill")
        cancelBtn.setAttribute("id", `bio-cancelBtn-${userID}`)
        cancelBtn.innerText = "Cancel"
        btnDiv.appendChild(cancelBtn)

        // todo: create a save btn
        const saveBtn = document.createElement("button")
        saveBtn.setAttribute("class", "btn btn-sm btn-success py-1 px-3 rounded-pill")
        saveBtn.setAttribute("id", `bio-saveBtn-${userID}`)
        saveBtn.innerText = "Save"
        btnDiv.appendChild(saveBtn)

        // todo: undo everything when cancel pressed
        cancelBtn.addEventListener("click", () => {
            if (bioDiv) {
                bioDiv.remove()
            }
            btnDiv.remove()
            textArea.remove()
            bioEl.style.display = "block"
            statsDiv.classList.replace("d-none", "d-flex")
        })

        // todo: disable button when there's more than 300 chars 
        textArea.addEventListener("input", () => {
            if (textArea.value.length > 300) {
                saveBtn.disabled = true
            } else {
                saveBtn.disabled = false
            }
        })

        // todo: fetch PUT request when "save" clicked 
        saveBtn.addEventListener("click", () => {

            fetch(`${originURL}/update_profile/${userID}`, {
                method: "PUT",
                body: JSON.stringify({
                    bio: textArea.value
                })
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Oops! Something went wrong.")
                    }
                    const bio = textArea.value
                    bioEl.textContent = bio

                    btnDiv.remove()
                    textArea.remove()

                    if (bio.trim() === "" && bioDiv) {
                        bioDiv.remove()
                    }

                    if (bioDiv) {
                        bioDiv.appendChild(bioEl)
                    }

                    if (bio.trim() !== "") {
                        bioEl.style.display = "block"
                    }

                    statsDiv.classList.replace("d-none", "d-flex")
                })
                .catch(err => {
                    // console.error(`••• Error: ${err}`)
                    const alertDiv = document.createElement("div")
                    alertDiv.setAttribute("class", "alert alert-danger shadow-lg")
                    alertDiv.setAttribute("role", "alert")
                    alertDiv.setAttribute("style", "position: fixed; right: 20px; top: 20px; z-index: 2")
                    alertDiv.innerHTML = `${err.message}`
                    document.body.appendChild(alertDiv)
                    setTimeout(() => {
                        alertDiv.remove()
                    }, 2000);
                })
        })


    }
})