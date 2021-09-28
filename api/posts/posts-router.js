const express = require('express')
const Posts = require('./posts-model')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find()
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({
            message: "The posts information could not be retrieved"
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            res.status(200).json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: "The post information could not be retrieved"
        })
    }
})

router.post('/', async (req, res) => {
    try {
        if(!req.body.title || !req.body.contents) {
            res.status(400).json({
                message: "Please provide title and contents for the post"
            })
        } else {
            const newPost = await Posts.insert(req.body)
            const postedPost = await Posts.findById(newPost.id)
            res.status(201).json(postedPost)
        }
    } catch (err) {
        res.status(500).json({
            message: "There was an error while saving the post to the database"
        })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const post = await Posts.findById(id)
        if(!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            if(!req.body.title || !req.body.contents) {
                res.status(400).json({
                    message: "Please provide title and contents for the post"
                })
            } else {
                await Posts.update(id, req.body)
                const updatedPost = await Posts.findById(id)
                res.status(200).json(updatedPost)
            }
        }
    } catch (err) {
        res.status(500).json({
            message: "The post information could not be modified"
        })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deletedPost = await Posts.findById(id)
        if(!deletedPost) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            await Posts.remove(id)
            res.status(200).json(deletedPost)
        }
    } catch (err) {
        res.status(500).json({
            message: "The post could not be removed"
        })
    }
})

router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params
        const post = await Posts.findById(id)
        if(!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            const comments = await Posts.findPostComments(id)
            res.status(200).json(comments)
        }
    } catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved"
        })
    }
})

module.exports = router
