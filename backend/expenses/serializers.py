from rest_framework import serializers
from .models import Category, Expense


class CategorySerializer(serializers.ModelSerializer):
    expense_count = serializers.IntegerField(read_only=True)
    total_spent = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Category
        fields = ["id", "name", "color", "icon", "created_at", "expense_count", "total_spent"]


class ExpenseSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source="category", read_only=True)

    class Meta:
        model = Expense
        fields = [
            "id",
            "description",
            "amount",
            "category",
            "category_detail",
            "date",
            "notes",
            "created_at",
            "updated_at",
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value


class ExpenseSummarySerializer(serializers.Serializer):
    """Used for the /summary endpoint."""
    total = serializers.DecimalField(max_digits=12, decimal_places=2)
    count = serializers.IntegerField()
    by_category = serializers.ListField()
    by_month = serializers.ListField()
