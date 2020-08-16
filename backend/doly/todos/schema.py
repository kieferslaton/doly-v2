import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from .models import Todo

class TodoType(DjangoObjectType):
    class Meta:
        model = Todo

class Query(graphene.ObjectType):
    todos = graphene.List(TodoType)

    def resolve_todos(self, info):
        user = info.context.user
        return Todo.objects.filter(user=user)

class CreateTodo(graphene.Mutation):
    todo = graphene.Field(TodoType)

    class Arguments:
        task = graphene.String()
        due = graphene.DateTime()
        tags = graphene.List(graphene.String)
        complete = graphene.Boolean()
        has_due_date = graphene.Boolean()
    
    def mutate(self, info, **kwargs):
        user = info.context.user or None
        task = kwargs.get('task', None)
        due = kwargs.get('due', None)
        tags = kwargs.get('tags', None)
        complete = kwargs.get('complete', None)
        has_due_date = kwargs.get('has_due_date', None)


        todo = Todo(task=task, due=due, tags=tags, complete=complete, has_due_date=has_due_date, user=user)
        todo.save()
        return CreateTodo(todo=todo)

class UpdateTodo(graphene.Mutation):
    todo = graphene.Field(TodoType)

    class Arguments:
        todo_id = graphene.Int(required=True) 
        task = graphene.String()
        due = graphene.DateTime()
        tags = graphene.List(graphene.String)
        complete = graphene.Boolean()
        has_due_date = graphene.Boolean()

    def mutate(self, info, todo_id, task, due, tags, complete, has_due_date):
        user = info.context.user
        todo = Todo.objects.get(id=todo_id)

        if todo.user != user:
            raise GraphQLError('Not permitted to update!')

        todo.task = task
        todo.due = due
        todo.tags = tags
        todo.complete = complete
        todo.has_due_date = has_due_date
        todo.save()

        return UpdateTodo(todo=todo)

class DeleteTodo(graphene.Mutation):
    todo_id = graphene.Int()

    class Arguments:
        todo_id = graphene.Int(required=True)

    def mutate(self, info, todo_id):
        user = info.context.user
        todo = Todo.objects.get(id=todo_id)

        if todo.user != user:
            raise GraphQLError('Not permitted to delete!')

        todo.delete()

        return DeleteTodo(todo_id=todo_id)

class Mutation(graphene.ObjectType):
    create_todo = CreateTodo.Field()
    update_todo = UpdateTodo.Field()
    delete_todo = DeleteTodo.Field()
