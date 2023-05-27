document.addEventListener("DOMContentLoaded", () => {

    const originURL = window.location.origin

    document.addEventListener("click", (event) => {
        const element = event.target
        // console.log(element);
        if (element.id.startsWith("editBtn")) {
            // console.log("editBtn id: ", element.dataset.id);
            const postID = element.dataset.id
            // todo: hide content
            const contentEl = document.querySelector(`#content-${postID}`)
            const prevContent = contentEl.textContent
            contentEl.style.display = "none"

            // todo: hide stats row
            const statsDiv = document.querySelector(`#post-stats-${postID}`)
            statsDiv.classList.replace("d-flex", "d-none")

            // todo: create text area pre-filled with prev. content
            const textArea = document.createElement("textarea")
            textArea.setAttribute("class", "form-control border border-0 px-0 pt-1 pb-0 mb-2 shadow-sm")
            textArea.setAttribute("style", "resize: none;")
            textArea.required = true
            textArea.setAttribute("id", `new-content-${postID}`)
            textArea.textContent = prevContent

            // todo: replace textarea with removed content element
            const parentDiv = document.querySelector(`#parent-${postID}`)
            parentDiv.appendChild(textArea)

            // todo: create div for button
            const btnDiv = document.createElement("div")
            btnDiv.setAttribute("class", "d-flex justify-content-end align-items-center mb-1 w-100 gap-2")
            btnDiv.setAttribute("style", "height: 36px;")
            // add item not inside but next to parentDiv
            parentDiv.insertAdjacentElement("afterend", btnDiv)

            // todo: create a cancel btn
            const cancelBtn = document.createElement("button")
            cancelBtn.setAttribute("class", "btn btn-sm btn-secondary py-0 rounded-pill")
            cancelBtn.setAttribute("id", `cancelBtn-${postID}`)
            cancelBtn.innerText = "Cancel"
            btnDiv.appendChild(cancelBtn)

            // todo: create a save btn
            const saveBtn = document.createElement("button")
            saveBtn.setAttribute("class", "btn btn-sm btn-success py-0 px-3 rounded-pill")
            saveBtn.setAttribute("id", `saveBtn-${postID}`)
            saveBtn.innerText = "Save"
            btnDiv.appendChild(saveBtn)

            // todo: undo everything when cancel pressed
            cancelBtn.addEventListener("click", () => {
                btnDiv.remove()
                textArea.remove()
                contentEl.style.display = "block"
                statsDiv.classList.replace("d-none", "d-flex")
            })

            // todo: disable button when area is empty
            textArea.addEventListener("input", () => {
                if (textArea.value.length <= 0 || textArea.value.length > 300) {
                    saveBtn.disabled = true
                } else {
                    saveBtn.disabled = false
                }
            })

            // todo: fetch PUT request when "save" clicked 
            saveBtn.addEventListener("click", () => {
                // does post belong to the user who requested
                const canEditEl = document.querySelector(`#canEdit-${postID}`)
                const canEdit = canEditEl.dataset.canEdit == "1" ? true : false

                fetch(`${originURL}/update_post/${postID}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        content: textArea.value
                    })
                })
                    .then(res => {
                        // console.log(res);
                        if (textArea.value.trim() === "") {
                            throw new Error("Must provide content!")
                        }
                        if (!canEdit) {
                            throw new Error("Sorry! You're not authorized for this.")
                        }
                        if (!res.ok) {
                            throw new Error("Oops! Something went wrong.")
                        }
                        const iconDiv = document.querySelector(`#edit-icon-div-${postID}`)
                        // add eraser icon if there is no icon already
                        if (iconDiv.childElementCount == 1) {
                            const icon = document.createElement("span")
                            icon.innerHTML = `<i class="fa-solid fa-eraser me-1 text-body-tertiary">`
                            iconDiv.insertAdjacentElement("afterbegin", icon)
                        }
                        const content = textArea.value
                        btnDiv.remove()
                        textArea.remove()
                        contentEl.textContent = content
                        contentEl.style.display = "block"
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


        } else if (element.id.startsWith("likeBtn")) {
            const postID = element.dataset.id
            const isLiked = element.classList.contains("heart-color")
            const likeCounterEl = document.querySelector(`#like-count-${postID}`)
            const isUserAuthenticated = document.querySelector("#isAuth").dataset.isAuth == "1" ? true : false
            if (isUserAuthenticated) {
                if (!isLiked) {

                    fetch(`${originURL}/like/${postID}`, {
                        method: "POST"
                    })
                        .then(res => {
                            // console.log(res);
                            if (!res.ok) {
                                throw new Error("Something went wrong!")
                            }
                            element.classList.replace("fa-regular", "fa-solid")
                            element.classList.add("heart-color")
                            likeCounterEl.innerHTML = parseInt(likeCounterEl.textContent) + 1

                        })
                        .catch(err => {
                            // console.log(err);
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

                } else {
                    fetch(`${originURL}/unlike/${postID}`, {
                        method: "POST"
                    })
                        .then(res => {
                            // console.log(res);
                            if (!res.ok) {
                                throw new Error("Something went wrong!")
                            }
                            element.classList.replace("fa-solid", "fa-regular")
                            element.classList.remove("heart-color")
                            likeCounterEl.innerHTML = parseInt(likeCounterEl.textContent) - 1

                        })
                        .catch(err => {
                            // console.log(err);
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
                }
            } else {
                // todo: if user is not logged in show an alert to login
                const alertDiv = document.createElement("div")
                alertDiv.setAttribute("class", "alert alert-info shadow-lg")
                alertDiv.setAttribute("role", "alert")
                alertDiv.setAttribute("style", "position: fixed; right: 20px; top: 20px; z-index: 2")
                const loginHref = document.querySelector("#login-href").dataset.loginhref
                alertDiv.innerHTML = `
                    You need to login. <a href="${loginHref}" class="alert-link">Login Page ➚</a>
                `
                document.body.appendChild(alertDiv)
                setTimeout(() => {
                    alertDiv.remove()
                }, 3000);

            }
        } else if (element.id.startsWith("deleteBtn")) {
            const postID = element.dataset.id
            const postDiv = element.closest(`#post-div-${postID}`)

            fetch(`${originURL}/delete_post/${postID}`, {
                method: "DELETE"
            })
                .then(res => {
                    // console.log(res);
                    if (!res.ok) {
                        throw new Error("Oops! Something went wrong.")
                    }
                    postDiv.setAttribute("style", "animation-name: hide; animation-duration: 1s; animation-fill-mode: forwards; animation-timing-function: linear; -webkit-animation-timing-function: linear; animation-play-state: paused;")
                    postDiv.style.animationPlayState = "running";

                    postDiv.addEventListener("animationend", () => {
                        postDiv.remove()
                    })
                })
                .catch(err => {
                    // console.log(err);
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
        }
    })
})







// ? IMPROVEMENTS
// when user click on edit, if there was any other attemp to edit a post, should be canceled